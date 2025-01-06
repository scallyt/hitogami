import { json } from "@sveltejs/kit";
import vision from '@google-cloud/vision';
import * as deepl from "deepl-node";
import { DEEPL_API_KEY, GOOGLE_CLIENT_ID_PATH } from "$env/static/private";
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

export async function POST({ request }: { request: Request }) { 
    const filename = request.headers.get('x-filename');
    const { languageFrom, languageTo } = await request.json();

    if (!filename) {
        return json({ error: 'Filename is missing' }, { status: 400 });
    }

    if (!languageFrom || !languageTo) {
        return json({ error: 'Languages are missing' }, { status: 400 });
    }

    const file = path.join(process.cwd(), 'static', 'uploads', filename);
    const result = await detectText(file);
    
    if (!result || !result.text) {
        return json({ error: 'No text detected in the image' }, { status: 400 });
    }

    const bubbles = detectBubbles(result.words);
    
    const completeText = bubbles.map(bubble => 
        bubble.words.map(w => w.text).join(' ')
    ).join('\n\n');

    const translator = new deepl.Translator(DEEPL_API_KEY);
    const translation = await translator.translateText(completeText, languageFrom, languageTo);
    
    const translatedBubbles = distributeToBubbles(translation.text, bubbles);

    try {
        const modifiedImageBuffer = await modifyImage(file, bubbles, translatedBubbles);
        
        const outputFilePath = path.join(process.cwd(), 'static', 'modified', filename);
        writeFileSync(outputFilePath, modifiedImageBuffer);
        
        return json({ success: true, message: 'Translation complete', imagePath: outputFilePath }, { status: 200 });
    } catch (error) {
        console.error('Error in image modification:', error);
        return json({ error: 'Failed to modify image with translation' }, { status: 500 });
    }
}

async function detectText(file: string) {
    try {
        const client = new vision.ImageAnnotatorClient({
            keyFilename: path.join(process.cwd(), GOOGLE_CLIENT_ID_PATH),
        });

        const [result] = await client.documentTextDetection(file);
        const fullTextAnnotation = result.fullTextAnnotation;
        
        if (!fullTextAnnotation) {
            console.log('No text detected in the image.');
            return null;
        }

        const words = result.textAnnotations?.slice(1).map(annotation => ({
            text: annotation.description || '',
            boundingBox: annotation.boundingPoly?.vertices?.map(vertex => ({
                x: vertex.x || 0,
                y: vertex.y || 0,
            })) || [],
        })) || [];

        console.log('Detected words:', JSON.stringify(words, null, 2));

        return {
            text: fullTextAnnotation.text,
            words: words
        };
    } catch (error) {
        console.error('Error during text detection:', error);
        throw error;
    }
}

interface Bubble {
    words: Array<{
        text: string;
        boundingBox: Array<{x: number, y: number}>;
    }>;
    bounds: {
        minX: number;
        maxX: number;
        minY: number;
        maxY: number;
        centerX: number;
        centerY: number;
        width: number;
        height: number;
    };
}

function detectBubbles(words: any[]): Bubble[] {
    const sortedWords = [...words].sort((a, b) => {
        const aY = Math.min(...a.boundingBox.map((p: any) => p.y));
        const bY = Math.min(...b.boundingBox.map((p: any) => p.y));
        return aY - bY;
    });

    const bubbles: Bubble[] = [];
    let currentBubble: any[] = [];
    let lastY = -1;
    const yThreshold = 50;

    for (const word of sortedWords) {
        const minY = Math.min(...word.boundingBox.map((p: any) => p.y));
        
        if (lastY === -1 || Math.abs(minY - lastY) <= yThreshold) {
            currentBubble.push(word);
        } else {
            if (currentBubble.length > 0) {
                bubbles.push(createBubble(currentBubble));
            }
            currentBubble = [word];
        }
        
        lastY = minY;
    }

    if (currentBubble.length > 0) {
        bubbles.push(createBubble(currentBubble));
    }

    return bubbles;
}

function createBubble(words: any[]): Bubble {
    const allPoints = words.flatMap(word => word.boundingBox);
    const minX = Math.min(...allPoints.map(p => p.x));
    const maxX = Math.max(...allPoints.map(p => p.x));
    const minY = Math.min(...allPoints.map(p => p.y));
    const maxY = Math.max(...allPoints.map(p => p.y));

    return {
        words,
        bounds: {
            minX,
            maxX,
            minY,
            maxY,
            centerX: (minX + maxX) / 2,
            centerY: (minY + maxY) / 2,
            width: maxX - minX,
            height: maxY - minY
        }
    };
}

function distributeToBubbles(translatedText: string, bubbles: Bubble[]): string[] {
    const paragraphs = translatedText.split('\n\n');
    
    if (paragraphs.length !== bubbles.length) {
        const averageLength = Math.floor(translatedText.length / bubbles.length);
        return bubbles.map((bubble, index) => {
            const start = index * averageLength;
            const end = Math.min((index + 1) * averageLength, translatedText.length);
            return translatedText.slice(start, end).trim();
        });
    }
    
    return paragraphs;
}

async function modifyImage(file: string, bubbles: Bubble[], translatedTexts: string[]) {
    const image = sharp(file);
    const metadata = await image.metadata();
    
    if (!metadata.width || !metadata.height) {
        throw new Error('Could not get image dimensions');
    }

    const composites: any[] = [];


    bubbles.forEach(bubble => {
        composites.push({
            input: Buffer.from(
                `<svg width="${metadata.width}" height="${metadata.height}">
                    <circle 
                        cx="${bubble.bounds.centerX}" 
                        cy="${bubble.bounds.centerY}" 
                        r="5" 
                        fill="red" 
                        stroke="white"
                        stroke-width="1"
                    />
                </svg>`
            ),
            top: 0,
            left: 0
        });

        bubble.words.forEach(word => {
            word.boundingBox.forEach(point => {
                composites.push({
                    input: Buffer.from(
                        `<svg width="${metadata.width}" height="${metadata.height}">
                            <circle 
                                cx="${point.x}" 
                                cy="${point.y}" 
                                r="2" 
                                fill="blue" 
                                stroke="white"
                                stroke-width="0.5"
                            />
                        </svg>`
                    ),
                    top: 0,
                    left: 0
                });
            });
        });
    });

    bubbles.forEach((bubble, index) => {
        const { bounds } = bubble;
        const padding = 15;

        composites.push({
            input: Buffer.from(
                `<svg width="${metadata.width}" height="${metadata.height}">
                    <rect 
                        x="${bounds.minX - padding}" 
                        y="${bounds.minY - padding}" 
                        width="${bounds.width + (padding * 2)}" 
                        height="${bounds.height + (padding * 2)}" 
                        fill="white"
                        fill-opacity="0.9"
                    />
                </svg>`
            ),
            top: 0,
            left: 0
        });

        const fontSize = Math.min(
            Math.floor(bounds.height * 0.09),
            Math.floor(bounds.width * 0.09)
        );

        const translatedText = translatedTexts[index] || '';
        const words = translatedText.split(' ');
        const lines: string[] = [];
        let currentLine = '';
        
        for (const word of words) {
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            const testWidth = testLine.length * (fontSize * 0.6);
            
            if (testWidth > bounds.width * 0.9) {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        }
        if (currentLine) {
            lines.push(currentLine);
        }

        const lineHeight = fontSize * 1.2;
        const totalTextHeight = lines.length * lineHeight;
        const startY = bounds.minY + (bounds.height - totalTextHeight) / 2;

        lines.forEach((line, lineIndex) => {
            composites.push({
                input: Buffer.from(
                    `<svg width="${metadata.width}" height="${metadata.height}">
                        <style>
                            @font-face {
                                font-family: 'CC Wild Words';
                                src: local('CC Wild Words');
                            }
                        </style>
                        <text 
                            x="${bounds.centerX}"
                            y="${startY + (lineIndex * lineHeight) + fontSize}"
                            font-family="CC Wild Words, Arial"
                            font-size="${fontSize}px"
                            font-weight="bold"
                            fill="black"
                            text-anchor="middle"
                            dominant-baseline="middle"
                        >${line}</text>
                    </svg>`
                ),
                top: 0,
                left: 0
            });
        });
    });

    return image.composite(composites).toBuffer();
}
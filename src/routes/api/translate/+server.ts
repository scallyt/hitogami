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

    const { text, words } = result;
    console.log('Detected words:', JSON.stringify(words, null, 2));

    const translator = new deepl.Translator(DEEPL_API_KEY);
    const translation = await translator.translateText(text, languageFrom, languageTo);
    console.log('Translation:', translation);

    try {
        const modifiedImageBuffer = await modifyImage(file, words, translation.text);
        
        const outputFilePath = path.join(process.cwd(), 'static', 'modified', filename);
        writeFileSync(outputFilePath, modifiedImageBuffer); // Save the buffer as a file
        
        return json({ success: true, message: 'Translation and image modification complete', imagePath: outputFilePath }, { status: 200 });
    } catch (error) {
        console.error('Error in image modification:', error);
        return json({ error: 'Failed to modify image with translation' }, { status: 500 });
    }
}

async function detectText(file: string): Promise<{ text: string, words: { text: string, boundingBox: { x: number, y: number }[] }[] } | null> {
    try {
        const client = new vision.ImageAnnotatorClient({
            keyFilename: path.join(process.cwd(), GOOGLE_CLIENT_ID_PATH),
        });

        const [result] = await client.documentTextDetection(file);
        
        if (result?.fullTextAnnotation?.text) {
            console.log('Detected text:', result.fullTextAnnotation.text);
            
            const words = result.textAnnotations?.slice(1).map(annotation => ({
                text: annotation.description ?? '',
                boundingBox: annotation.boundingPoly?.vertices?.map(vertex => ({
                    x: vertex.x ?? 0,
                    y: vertex.y ?? 0,
                })) ?? [],
            })) ?? [];

            return {
                text: result.fullTextAnnotation.text,
                words
            };
        }
        
        console.log('No text detected in the image.');
        return null;
    } catch (error) {
        console.error('Error during text detection:', error);
        throw error;
    }
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
async function modifyImage(file: string, words: any[], translatedText: string) {
    const image = sharp(file);
    const metadata = await image.metadata();
    
    if (!metadata.width || !metadata.height) {
        throw new Error('Could not get image dimensions');
    }

    const bubbleGroups = groupWordsByBubble(words);
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const composites: any[] = [];

    for (const group of bubbleGroups) {
        const boundingBoxes = group.map(word => word.boundingBox);
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        const minX = Math.min(...boundingBoxes.flatMap(box => box.map((p: { x: any; }) => p.x)));
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        const maxX = Math.max(...boundingBoxes.flatMap(box => box.map((p: { x: any; }) => p.x)));
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        const minY = Math.min(...boundingBoxes.flatMap(box => box.map((p: { y: any; }) => p.y)));
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        const maxY = Math.max(...boundingBoxes.flatMap(box => box.map((p: { y: any; }) => p.y)));

        const padding = 15;
        
        composites.push({
            input: Buffer.from(
                `<svg width="${metadata.width}" height="${metadata.height}">
                    <rect 
                        x="${minX - padding}" 
                        y="${minY - padding}" 
                        width="${maxX - minX + (padding * 2)}" 
                        height="${maxY - minY + (padding * 2)}" 
                        fill="white"
                    />
                </svg>`
            ),
            top: 0,
            left: 0
        });
    }

    for (const group of bubbleGroups) {
        const boundingBoxes = group.map(word => word.boundingBox);
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        const minX = Math.min(...boundingBoxes.flatMap(box => box.map((p: { x: any; }) => p.x)));
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        const minY = Math.min(...boundingBoxes.flatMap(box => box.map((p: { y: any; }) => p.y)));
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        const maxX = Math.max(...boundingBoxes.flatMap(box => box.map((p: { x: any; }) => p.x)));
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        const maxY = Math.max(...boundingBoxes.flatMap(box => box.map((p: { y: any; }) => p.y)));

        const bubbleWidth = maxX - minX;
        const bubbleHeight = maxY - minY;
        
        const fontSize = Math.min(
            Math.floor(bubbleHeight * 0.09),
            Math.floor(bubbleWidth * 0.09)
        );

        const text = group.map(w => w.text).join(' ');
        
        const words = text.split(' ');
        const lines: string[] = [];
        let currentLine = '';
        
        for (const word of words) {
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            const testWidth = testLine.length * (fontSize * 0.6);
            
            if (testWidth > bubbleWidth * 0.9) {
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
        const startY = minY + (bubbleHeight - totalTextHeight) / 2;

        lines.forEach((line, index) => {
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
                            x="${minX + bubbleWidth / 2}"
                            y="${startY + (index * lineHeight) + fontSize}"
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
    }

    return image.composite(composites).toBuffer();
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function groupWordsByBubble(words: any[]) {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const groups: any[][] = [];
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    let currentGroup: any[] = [];
    let lastY = -1;
    const yThreshold = 50;

    const sortedWords = [...words].sort((a, b) => {
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        const aY = Math.min(...a.boundingBox.map((p: any) => p.y));
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        const bY = Math.min(...b.boundingBox.map((p: any) => p.y));
        return aY - bY;
    });

    for (const word of sortedWords) {
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        const minY = Math.min(...word.boundingBox.map((p: any) => p.y));
        
        if (lastY === -1 || Math.abs(minY - lastY) <= yThreshold) {
            currentGroup.push(word);
        } else {
            if (currentGroup.length > 0) {
                groups.push(currentGroup);
            }
            currentGroup = [word];
        }
        
        lastY = minY;
    }

    if (currentGroup.length > 0) {
        groups.push(currentGroup);
    }

    return groups;
}
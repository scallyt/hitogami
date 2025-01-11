<script>
    import Navbar from "$lib/components/Navbar/Navbar.svelte";

    const navItems = [
        { name: "Kezdőlap", href: "#home" },
        { name: "Funkciók", href: "#features" },
        { name: "Demo", href: "#demo" },
        { name: "Bejelentkezés", href: "/user/login" },
    ];
</script>

<main>
    <style>
        :root {
            --primary: white;
            --secondary: green;
            --text: #ffffff;
            --background: black;
            --transition-duration: 1s;
        }

        html {
            scroll-behavior: smooth;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', sans-serif;
        }

        body {
            background: var(--background);
            color: var(--text);
            min-height: 100vh;
            overflow-x: hidden;
        }

        .background {
            position: fixed;
            width: 100vw;
            height: 100vh;
            background: 
                radial-gradient(circle at 20% 20%, var(--primary) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, var(--secondary) 0%, transparent 50%);
            opacity: 0.15;
            z-index: -1;
        }

        .hero {
            max-width: 1200px;
            margin: 4rem auto;
            padding: 2rem;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4rem;
            align-items: center;
        }

        .hero-text h1 {
            font-size: 3.5rem;
            margin-bottom: 1.5rem;
            animation: slideIn 1s ease-out;
        }

        @keyframes slideIn {
            from {
                transform: translateX(-100px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        .hero-text p {
            font-size: 1.2rem;
            line-height: 1.6;
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 2rem;
            animation: fadeIn 1s ease-out 0.5s backwards;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }

        .cta-button {
            display: inline-block;
            padding: 1rem 2rem;
            background: linear-gradient(45deg, var(--primary), var(--secondary));
            border: none;
            border-radius: 50px;
            color: var(--text);
            font-size: 1.1rem;
            cursor: pointer;
            transition: transform 0.3s, box-shadow 0.3s;
            position: relative;
            overflow: hidden;
        }

        .cta-button::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: rgba(255, 255, 255, 0.2);
            transform: rotate(45deg);
            transition: transform 0.6s;
        }

        .cta-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        }

        .cta-button:hover::before {
            transform: rotate(45deg) translateX(100%);
        }

        .hero-image {
            position: relative;
            animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
            0%, 100% {
                transform: translateY(0);
            }
            50% {
                transform: translateY(-20px);
            }
        }

        .hero-image img {
            width: 100%;
            height: auto;
            border-radius: 20px;
            box-shadow: 0 0 30px rgba(109, 40, 217, 0.3);
        }

        .features {
            max-width: 1600px;
            margin: 6rem auto;
            padding: 2rem;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8rem;
            margin-bottom: 14rem;
        }

        .feature-card {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 20px;
            padding: 2rem;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: transform 0.3s, box-shadow 0.3s;
            font-size: 1.7rem;
        }

        .feature-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 10px 30px rgba(109, 40, 217, 0.2);
        }

        .feature-card h3 {
            font-size: 1.5rem;
            margin-bottom: 1rem;
            background: linear-gradient(45deg, var(--primary), var(--secondary));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .feature-card p {
            color: rgba(255, 255, 255, 0.8);
            line-height: 1.6;
        }

        @media (max-width: 768px) {
            .hero {
                grid-template-columns: 1fr;
                text-align: center;
            }

            .features {
                grid-template-columns: 1fr;
            }

            .hero-text h1 {
                font-size: 2.5rem;
            }

            .nav-links {
                display: none;
            }
        }

        .before-after {
            max-width: 1200px;
            margin: 6rem auto;
            padding: 2rem;
            text-align: center;
        }

        .before-after h2 {
            font-size: 2rem;
            margin-bottom: 3rem;
            background: linear-gradient(45deg, var(--primary), var(--secondary));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .comparison-container {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 2rem;
            flex-wrap: wrap;
        }

        .image-container {
            position: relative;
            flex: 1;
            min-width: 300px;
            max-width: 500px;
        }

        .image-container img {
            width: 100%;
            height: auto;
            border-radius: 20px;
            transition: transform 0.3s;
        }

        .image-container:hover img {
            transform: scale(1.05);
        }

        .image-label {
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.7);
            padding: 0.5rem 1.5rem;
            border-radius: 50px;
            backdrop-filter: blur(5px);
        }

        .arrow-container {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
        }

        .arrow {
            font-size: 2rem;
            color: var(--secondary);
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0% {
                transform: scale(1);
                opacity: 1;
            }
            50% {
                transform: scale(1.2);
                opacity: 0.7;
            }
            100% {
                transform: scale(1);
                opacity: 1;
            }
        }

        @media (max-width: 768px) {
            .comparison-container {
                flex-direction: column;
            }

            .arrow-container {
                transform: rotate(90deg);
            }
        }

        .section-title {
            font-size: 2.5rem;
            text-align: center;
            margin-bottom: 3rem;
            background: linear-gradient(45deg, var(--primary), var(--secondary));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .comparison-container {
            height: 60vh;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 2rem;
        }

        .image-container {
            height: 100%;
            max-height: 500px;
            width: auto;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .image-container img {
            height: 100%;
            width: auto;
            object-fit: contain;
            border-radius: 20px;
            transition: transform 0.3s;
        }

        @media (max-width: 768px) {
            .comparison-container {
                height: auto;
                flex-direction: column;
            }

            .image-container {
                height: 40vh;
                width: 100%;
            }

            .image-container img {
                width: 100%;
                height: auto;
            }
        }

    </style>
    <div class="background"></div>
    <nav>
        <Navbar navItems={navItems} />
    </nav>

    <div class="scroll-container">
        <div id="home" class="hero-section">
            <div class="hero">
                <div class="hero-text">
                    <h1>Fordítsd le kedvenc mangáidat másodpercek alatt!</h1>
                    <p>Használd AI-alapú fordító rendszerünket, hogy azonnal hozzáférj kedvenc mangáid tartalmához bármilyen nyelven.</p>
                    <button class="cta-button">Próbáld ki most!</button>
                </div>
                <div class="hero-image">
                    <img src="https://placehold.co/600x400" alt="Manga translation example">
                </div>
            </div>
        </div>

    <div id="features">
            <h2 class="section-title">Funkciók</h2>
            <div class="features">
                <div class="feature-card">
                    <h3>Gyors Fordítás</h3>
                    <p>AI-powered technológiánk másodpercek alatt lefordítja a manga oldalakat, megtartva az eredeti formázást.</p>
                </div>
                <div class="feature-card">
                    <h3>Pontos Eredmény</h3>
                    <p>Fejlett gépi tanulási modellünk biztosítja a fordítások pontosságát és természetességét.</p>
                </div>
                <div class="feature-card">
                    <h3>Egyszerű Használat</h3>
                    <p>Csak töltsd fel a képet, válaszd ki a célnyelvet, és készen is vagy! Nincs szükség extra beállításokra.</p>
                </div>
            </div>
        </div>

    <div id="demo" class="before-after">
        <h2>Lásd a különbséget!</h2>
        <div class="comparison-container">
            <div class="image-container">
                <img src="/pics/before.jpg" alt="Eredeti manga">
                <div class="image-label">Eredeti</div>
            </div>
            <div class="arrow-container">
                <div class="arrow">→</div>
            </div>
            <div class="image-container">
                <img src="/pics/after.jpg" alt="Lefordított manga">
                <div class="image-label">Lefordítva</div>
            </div>
        </div>
    </div>

</main>
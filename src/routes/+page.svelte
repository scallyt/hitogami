<main>
    <style>
        :root {
            --primary: #6d28d9;
            --secondary: #db2777;
            --text: #ffffff;
            --background: #1a1a2e;
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

        nav {
            padding: 1.5rem;
            backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            position: sticky;
            top: 0;
            z-index: 100;
        }

        .nav-content {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo {
            font-size: 2rem;
            font-weight: bold;
            background: linear-gradient(45deg, var(--primary), var(--secondary));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: glow 2s ease-in-out infinite alternate;
        }

        @keyframes glow {
            from {
                text-shadow: 0 0 10px rgba(109, 40, 217, 0.5);
            }
            to {
                text-shadow: 0 0 20px rgba(219, 39, 119, 0.8);
            }
        }

        .nav-links a {
            color: var(--text);
            text-decoration: none;
            margin-left: 2rem;
            position: relative;
            transition: color 0.3s;
        }

        .nav-links a::after {
            content: '';
            position: absolute;
            bottom: -5px;
            left: 0;
            width: 0;
            height: 2px;
            background: linear-gradient(90deg, var(--primary), var(--secondary));
            transition: width 0.3s;
        }

        .nav-links a:hover::after {
            width: 100%;
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
            max-width: 1200px;
            margin: 6rem auto;
            padding: 2rem;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 2rem;
        }

        .feature-card {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 20px;
            padding: 2rem;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: transform 0.3s, box-shadow 0.3s;
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
    </style>
    <div class="background"></div>
    <nav>
        <div class="nav-content">
            <div class="logo">MangaTranslator</div>
            <div class="nav-links">
                <a href="#features">Funkciók</a>
                <a href="#about">Rólunk</a>
                <a href="#login">Bejelentkezés</a>
            </div>
        </div>
    </nav>

    <section class="hero">
        <div class="hero-text">
            <h1>Fordítsd le kedvenc mangáidat másodpercek alatt!</h1>
            <p>Használd AI-alapú fordító rendszerünket, hogy azonnal hozzáférj kedvenc mangáid tartalmához bármilyen nyelven.</p>
            <button class="cta-button">Próbáld ki most!</button>
        </div>
        <div class="hero-image">
            <img src="/api/placeholder/600/400" alt="Manga translation example">
        </div>
    </section>

    <section class="features">
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
    </section>
</main>
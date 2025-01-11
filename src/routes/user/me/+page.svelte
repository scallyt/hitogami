<script>
    import Navbar from "$lib/components/Navbar/Navbar.svelte";

    const navItems = [
        { name: "Home", href: "/" },
        { name: "Register", href: "/user/logout" },
    ];
</script>

<svelte:head>
    <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.2.3/css/flag-icons.min.css"
    />
</svelte:head>
<main>
    <div class="backround"></div>
    <nav>
        <Navbar {navItems} />
    </nav>

    <div class="token-info">
        <div class="info-icon">
            <span class="material-icons">account_balance_wallet</span>
        </div>
        <div class="info-text">
            <p>You have <strong>9 tokens</strong> left.</p>
            <p>Would you like to purchase more tokens?</p>
        </div>
        <div class="info-actions">
            <button class="buy-button">
                <span class="material-icons">add_circle</span> Buy Tokens
            </button>
        </div>
    </div>

    <div class="translation-cards-container">
        <div class="translation-card">
            <div class="card-content">
                <!-- svelte-ignore a11y_img_redundant_alt -->
                <img
                    class="thumbnail"
                    src="https://placehold.co/200x280"
                    alt="Image Placeholder"
                />
                <div class="details">
                    <p><strong>Created At:</strong> 2025.01.24</p>
                    <p>
                        <strong>Language From:</strong>
                        <span class="flag fi fi-es"></span> Spanish
                    </p>
                    <p>
                        <strong>Language To:</strong>
                        <span class="flag fi fi-hu"></span> Hungarian
                    </p>
                    <p><strong>Token Cost:</strong> 9</p>
                </div>
            </div>
        </div>
    </div>
</main>

<style>
    :root {
        --primary: white;
        --secondary: green;
        --text: #ffffff;
        --background: black;
        --transition-duration: 1s;

        background: var(--background);
        color: var(--text);
        min-height: 100vh;
        overflow-x: hidden;
    }

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: "Segoe UI", sans-serif;
    }

    .backround {
        position: fixed;
        width: 100vw;
        height: 100vh;
        background: radial-gradient(
                circle at 20% 20%,
                var(--primary) 0%,
                transparent 50%
            ),
            radial-gradient(
                circle at 80% 80%,
                var(--secondary) 0%,
                transparent 50%
            );
        opacity: 0.15;
        z-index: -1;
    }

    .container {
        max-width: 400px;
        margin: 4rem auto;
        padding: 2rem;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 20px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        animation: slideIn 1s ease-out;
    }

    @keyframes slideIn {
        from {
            transform: translateY(-50px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }

    h1 {
        font-size: 2.5rem;
        margin-bottom: 2rem;
        text-align: center;
        background: linear-gradient(45deg, var(--primary), var(--secondary));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 1.5rem;
    }

    input {
        padding: 1rem;
        border: none;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.1);
        color: var(--text);
        font-size: 1rem;
        transition: all 0.3s ease;
    }

    input::placeholder {
        color: rgba(255, 255, 255, 0.5);
    }

    input:focus {
        outline: none;
        background: rgba(255, 255, 255, 0.15);
        box-shadow: 0 0 10px rgba(0, 255, 0, 0.2);
    }

    button {
        padding: 1rem;
        border: none;
        border-radius: 10px;
        background: linear-gradient(45deg, var(--primary), var(--secondary));
        color: var(--text);
        font-size: 1.1rem;
        cursor: pointer;
        transition:
            transform 0.3s,
            box-shadow 0.3s;
        position: relative;
        overflow: hidden;
    }

    button:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    }

    button::before {
        content: "";
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: rgba(255, 255, 255, 0.2);
        transform: rotate(45deg);
        transition: transform 0.6s;
    }

    button:hover::before {
        transform: rotate(45deg) translateX(100%);
    }

    div:last-child {
        text-align: center;
        color: rgba(255, 255, 255, 0.8);
    }

    a {
        color: var(--secondary);
        text-decoration: none;
        transition: color 0.3s;
    }

    a:hover {
        color: var(--primary);
        text-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
    }

    @media (max-width: 768px) {
        .container {
            margin: 2rem;
            padding: 1.5rem;
        }

        h1 {
            font-size: 2rem;
        }
    }

    .translation-cards-container {
        display: flex;
        flex-wrap: wrap;
        gap: 1.5rem;
        justify-content: center; /* Középre igazítás */
        padding: 2rem;
    }

    .translation-card {
        flex: 1 1 calc(33.33% - 1.5rem);
        max-width: 300px;
        margin: auto;
        padding: 1rem;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 15px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
        transition:
            transform 0.3s,
            box-shadow 0.3s;
    }

    .translation-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
    }

    .card-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }

    .thumbnail {
        width: 100%;
        height: auto;
        border-radius: 10px;
        object-fit: cover;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    }

    .details {
        text-align: center;
        color: rgba(255, 255, 255, 0.8);
    }

    .details p {
        margin: 0.5rem 0;
    }

    .details .flag {
        display: inline-block;
        margin-left: 0.5rem;
        vertical-align: middle;
        width: 20px;
        height: 14px;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
        border-radius: 3px;
    }

    @media (max-width: 768px) {
        .translation-card {
            flex: 1 1 calc(50% - 1.5rem); /* 2 oszlop kisebb képernyőn */
        }
    }

    @media (max-width: 480px) {
        .translation-card {
            flex: 1 1 100%; /* 1 oszlop mobilon */
        }
    }

    .token-info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(10px);
        transition:
            transform 0.3s,
            box-shadow 0.3s;
        gap: 1rem;
        max-width: 400px;
        margin: 2rem auto;
    }

    .token-info:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
    }

    /* Icon section */
    .info-icon {
        font-size: 2rem;
        color: var(--secondary, green);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }

    /* Text content */
    .info-text {
        flex: 1;
        color: rgba(255, 255, 255, 0.8);
        font-size: 1rem;
        line-height: 1.5;
    }

    .info-text strong {
        color: var(--primary, white);
    }

    /* Action button */
    .info-actions .buy-button {
        display: flex;
        align-items: center;
        background: linear-gradient(
            45deg,
            var(--primary, white),
            var(--secondary, green)
        );
        color: var(--text, white);
        border: none;
        border-radius: 5px;
        padding: 0.5rem 1rem;
        cursor: pointer;
        transition:
            transform 0.3s,
            box-shadow 0.3s;
        font-size: 1rem;
        font-weight: bold;
        gap: 0.5rem;
        text-shadow: 0 0 5px rgba(0, 255, 0, 0.2);
    }

    .info-actions .buy-button:hover {
        transform: scale(1.05);
        box-shadow: 0 4px 15px rgba(0, 255, 0, 0.3);
    }

    .material-icons {
        vertical-align: middle;
        font-size: 1.5rem;
    }
</style>

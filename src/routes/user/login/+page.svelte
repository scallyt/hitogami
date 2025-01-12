<script lang="ts">
    import Navbar from "$lib/components/Navbar/Navbar.svelte";
    import { getFlash } from "sveltekit-flash-message";
    import { page } from "$app/state";

    const navItems = [
        { name: "Home", href: "/" },
        { name: "Register", href: "/user/register" },
    ];

    const { form } = $props();
    const flash = getFlash(page);

    console.log(flash)
</script>

<main>
    <div class="backround"></div>
    <nav>
        <Navbar {navItems} />
    </nav>
    <div class="container">
        <h1>Login</h1>
        <div class="flash">
        {#if $flash}
            {@const bg = $flash.type == "success" ? "#3D9970" : "#FF4136"}
            <div style:background-color={bg} class="flash">
                {$flash.message}
            </div>
        {/if}
        </div>
        <form method="post" action="?/login">
            {#if form?.errors?.email}
                <div class="error"><p>{form.errors.email}</p></div>
            {/if}
            <input type="email" name="email" placeholder="Email" />
            {#if form?.errors?.password[0]}
                <div class="error"><p>{form.errors.password[0]}</p></div>
            {/if}
            <input type="password" name="password" placeholder="Password" />
            <button type="submit">Login</button>
        </form>
        <div>
            You don't have an account? <a href="/user/register">Register</a>
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
</style>

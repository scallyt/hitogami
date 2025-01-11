<script>
    const { navItems } = $props();

    console.log(navItems);
</script>

<nav>
    <div class="nav-content">
        <div class="logo">Hitogami</div>
        <div class="nav-links">
            {#if navItems}
                {#each navItems as navItem}
                    <a href={navItem.href}>{navItem.name}</a>
                {/each}
            {/if}
        </div>
    </div>
</nav>

<style>
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
            text-shadow: 0 0 10px green;
        }
        to {
            text-shadow: 0 0 20px #0a2e36;
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
        content: "";
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
</style>

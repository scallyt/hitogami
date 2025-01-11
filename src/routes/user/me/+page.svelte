<script>

    import Navbar from "$lib/components/Navbar/Navbar.svelte";

    const navItems = [
        { name: "Home", href: "/" },
        { name: "Register", href: "/user/logout" },
    ];
</script>
<main>
    <nav>
        <Navbar navItems={navItems}/>
    </nav>
</main>
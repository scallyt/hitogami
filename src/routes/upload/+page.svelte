<script lang="ts">
    const { form } = $props();

    const languages: string[] = [
        "en",
        "de",
        "fr",
        "es",
        "it",
        "pt",
        "ru",
        "ja",
        "zh",
        "ko",
        "hu",
    ];
</script>

<main>
    {#if form?.error}
        <h2>Upload failed: {form.message}</h2>
    {/if}
    {#if form?.success}
        <h2>{form.message}</h2>
    {/if}

    <div>
        <form method="POST" action="?/upload" enctype="multipart/form-data">
            <fieldset>
                <legend>Language Selection</legend>
                <div>
                    <label for="language-from">Language From:</label>
                    <select name="language-from" id="language-from" required>
                        {#each languages as language}
                            <option value={language}>{language}</option>
                        {/each}
                    </select>
                </div>
                <div>
                    <label for="language-to">Language To:</label>
                    <select name="language-to" id="language-to" required>
                        {#each languages as language}
                            <option value={language}>{language}</option>
                        {/each}
                    </select>
                </div>
            </fieldset>
    
            <fieldset>
                <legend>File Upload</legend>
                <div>
                    <label for="file-upload">Select File:</label>
                    <input
                        type="file"
                        name="file-upload"
                        id="file-upload"
                        accept="image/png,image/jpeg,image/webp,image/jpg"
                        required
                    />
                </div>
            </fieldset>
    
            <button type="submit">Upload</button>
        </form>
    </div>
    
</main>

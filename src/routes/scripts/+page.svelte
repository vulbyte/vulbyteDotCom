<script>
    const scripts = [
        {name:'0001-fnafSecurityBreach', link:'0001-fnafSecurityBreach'},
        {name:'0003-whichMK8Caracter?', link:'0003-whichMk8CharIsTheMostPopular'}
    ]
</script>

<div>
    welcome to my scripts!

    <ul>
        {#each scripts as script}
            <li><a href='./scripts/{script.link}'>{script.name}</a></li>
        {/each}
    </ul>
</div>

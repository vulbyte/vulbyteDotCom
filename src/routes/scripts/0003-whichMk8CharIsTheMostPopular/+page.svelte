<script>
	import { onMount } from "svelte";

    const missingTexture = "$lib/Missing_Texture_JE4.webp";
    const characters = [
        {
            "name": "mario",
            "icon": "https://static.wikia.nocookie.net/mario/images/2/2a/MK8_Mario_icon.png",
            "value": 0,
        },
        {
            "name": "luigi",
            "icon": "https://static.wikia.nocookie.net/mariokart/images/5/51/MK8_Luigi_Icon.png",
            "value": 0,
        },
        {
            "name": "peach",
            "icon": "https://static.wikia.nocookie.net/mariokart/images/c/c2/MK8_Peach_Icon.png",
            "value": 0,
        },
        {
            "name": "daisy",
            "icon": "https://static.wikia.nocookie.net/mariokart/images/3/32/MK8_Daisy_Icon.png",
            "value": 0,
        },
        {
            "name": "rosalina",
            "icon": "https://static.wikia.nocookie.net/fantendo/images/9/99/RosalinaIconMK8.png",
            "value": 0,
        },
        {
            "name": "tanooki mario",
            "icon": "https://static.wikia.nocookie.net/mario/images/f/fe/Tanooki_Mario_SM3DW.png",
            "value": 0,
        },
        {
            "name": "cat peach",
            "icon": "https://static.wikia.nocookie.net/we-are-peach/images/0/09/MKT_Cat_Peach.png",
            "value": 0,
        },
        { 
            "name": "birdo",
            "icon": "https://static.wikia.nocookie.net/mariokart/images/f/f6/MK8D_Birdo_Icon.png",
            "value": 0,
        },
        {
            "name": "yoshi",
            "icon": "https://static.wikia.nocookie.net/fantendo/images/8/85/YoshiIconMK8.png",
            "value": 0,
        },
        {
            "name": "toad",
            "icon": "https://static.wikia.nocookie.net/mariokart/images/4/45/MK8_Toad_Icon.png",
            "value": 0,
        },
        {
            "name": "koopa troopa",
            "icon": "https://static.wikia.nocookie.net/mariokart/images/b/bc/MK8_Koopa_Icon.png",
            "value": 0,
        },
        {
            "name": "shy dood",
            "icon": "https://static.wikia.nocookie.net/mariokart/images/7/7f/MK8_ShyGuy_Icon.png",
            "value": 0,
        },
        {
            "name": "lakitu",
            "icon": "https://static.wikia.nocookie.net/mariokart/images/7/7d/MK8_Lakitu_Icon.png",
            "value": 0,
        },
        {
            "name": "toadette",
            "icon": "https://static.wikia.nocookie.net/mariokart/images/8/8e/MK8_Toadette_Icon.png",
            "value": 0,
        },
        {
            "name": "king boo",
            "icon": "https://static.wikia.nocookie.net/mariokart/images/2/27/King_Boo_-_Mario_Kart_Wii.PNG",
            "value": 0,
        },
        {
            "name": "petey piranha",
            "icon": "https://static.wikia.nocookie.net/mariokart/images/6/6b/MK8D_Petey_Piranha_Icon.webp",
            "value": 0,
        },
        {
            "name": "baby mario", 
            "icon": "https://static.wikia.nocookie.net/mariokart/images/d/d2/MK8_BabyMario_Icon.png",
            "value": 0,
        },
        {
            "name": "baby luigi", 
            "icon": "https://static.wikia.nocookie.net/mariokart/images/a/aa/MK8_BabyLuigi_Icon.png",
            "value": 0,
        },
        {
            "name": "baby peach", 
            "icon": "https://static.wikia.nocookie.net/mariokart/images/3/3d/MK8_BabyPeach_Icon.png",
            "value": 0,
        },
        {
            "name": "baby daisy",
            "icon": "https://static.wikia.nocookie.net/fantendo/images/3/31/BabyDaisyIconMK8.png",
            "value": 0,
        },
        {
            "name": "baby rosalina",
            "icon": "https://static.wikia.nocookie.net/mariokart/images/0/09/MK8_BabyRosalina_Icon.png",
            "value": 0,

        },
        {
            "name": "metal mario", 
            "icon": "https://static.wikia.nocookie.net/mariokart/images/f/f9/120px-MK8_MMario_Icon.png",
            "value": 0,
        },
        {
            "name": "metal peach", 
            "icon": "https://static.wikia.nocookie.net/mariokart/images/0/0d/MK8_PGPeach_Icon.png",
            "value": 0,
        },
        {
            "name": "wiggler",
            "icon": "https://static.wikia.nocookie.net/mariokart/images/5/5e/MK8D_Wiggler_Icon.webp",
            "value": 0,
        },
        {
            "name": "wario",
            "icon": "https://static.wikia.nocookie.net/mariokart/images/c/c2/MK8_Wario_Icon.png",
            "value": 0,
        },
        {
            "name": "waluigi",
            "icon": "https://i.redd.it/n3j7iuu8sps41.jpg",
            "value": 0,
        },
        {
            "name": "donkey kong",
            "icon": "https://static.wikia.nocookie.net/mariokart/images/0/08/MK8_DKong_Icon.png",
            "value": 0,
        },
        {
            "name": "bowser", 
            "icon": "https://static.wikia.nocookie.net/mariokart/images/4/47/MK8_Bowser_Icon.png",
            "value": 0,
        },
        {
            "name": "dry bonez",
            "icon": "https://static.wikia.nocookie.net/fantendo/images/3/3f/MK8DX_Dry_Bones_Icon.png",
            "value": 0,
        },
        {
            "name": "bowser jr", 
            "icon": "https://static.wikia.nocookie.net/mariokart/images/0/0d/Bowser_Jr._MK8Deluxe.png",
            "value": 0,
        },
        {
            "name": "dry bowser",
            "icon": "https://static.wikia.nocookie.net/mariokart/images/2/29/MK8_Dry_Bowser_Icon.png",
            "value": 0,
        },
        {
            "name": "kamek",
            "icon": "https://static.wikia.nocookie.net/mariokart/images/8/8b/Unused_Kamek_Emblem_%28Mario_Kart_8%29.webp",
            "value": 0,
        },
        {
            "name": "lemmy", 
            "icon": "https://static.wikia.nocookie.net/mariokart/images/f/fc/MK8_Lemmy_Icon.png",
            "value": 0,
        },
        {
            "name": "larry", 
            "icon": "https://static.wikia.nocookie.net/mariokart/images/c/c2/MK8_Larry_Icon.png",
            "value": 0,
        },
        {
            "name": "wendy",
            "icon": "https://static.wikia.nocookie.net/mariokart/images/d/d9/MK8_Wendy_Icon.png",
            "value": 0,
        },
        {
            "name": "ludwig", 
            "icon": "https://static.wikia.nocookie.net/mariokart/images/a/a8/MK8_Ludwig_Icon.png",
            "value": 0,
        },
        {
            "name": "iggy",
            "icon": "https://static.wikia.nocookie.net/mariokart/images/d/dd/MK8_Iggy_Icon.png",
            "value": 0,
        },
        {
            "name": "roy", 
            "icon": "https://static.wikia.nocookie.net/mariokart/images/3/3e/MK8_Roy_Icon.png",
            "value": 0,
        },
        {
            "name": "morton",
            "icon": "https://static.wikia.nocookie.net/mario/images/7/72/MK8_Morton_Icon.png",
            "value": 0,
        },
        {
            "name": "peachette",
            "icon": "https://static.wikia.nocookie.net/mariokart/images/7/78/Peachette_SMBUD.png",
            "value": 0,
        },
        {
            "name": "inklings",
            "icon": "https://static.wikia.nocookie.net/mariokart/images/b/b9/MK8DX_Female_Inkling_Icon.png",
            "value": 0,
        },
        {
            "name": "link",
            "icon": "https://www.zeldadungeon.net/wiki/images/thumb/0/0b/Link_-_MK8_icon.png/120px-Link_-_MK8_icon.png",
            "value": 0,
        },
        {
            "name": "villager", 
            "icon": "https://static.wikia.nocookie.net/mariokart/images/1/16/VillagerMale-Icon-MK8.png",
            "value": 0,
        },
        {
            "name": "✨isabell✨", 
            "icon": "https://static.wikia.nocookie.net/mariokart/images/2/20/MK8_Isabelle_Icon.png",
            "value": 0,
        },
        {
            "name": "diddy kong", 
            "icon": "https://static.wikia.nocookie.net/mariokart/images/8/82/DiddyTour.png",
            "value": 0,
        },
        {
            "name": "funky kong", 
            "icon": "https://www.seekpng.com/png/full/189-1890436_funky-funky-kong-mario-kart-wii.png",
            "value": 0,
        },
        {
            "name": "pauline", 
            "icon": "https://static.wikia.nocookie.net/mk-tour/images/1/10/MKT_Icon_PaulineRose.png",
            "value": 0,
        },
        {
            "name": "mii", 
            "icon": "https://static.wikia.nocookie.net/supersmashbrosultimate/images/b/b1/Mii-0.png",
            "value": 0,
        },
    ];

    /**
    * @param {number} index
    */
    function incrementValue(index) {
       characters[index].value = characters[index].value+1; 
    }

    /**
    * @param {number} index
    */
    function decrementValue(index) {
       characters[index].value = characters[index].value-1; 
    }

    function voidFunc(){};

</script>

<div>
    <h1>
        Which Mk8 Character Is The Most Popular?
    </h1>
    <div 
    class="characterContainer"
    style="
        display: grid; 
        flex-direction: row;
        grid-template-columns: 
            repeat(auto-fit, minmax(64px, 128px));
        max-width: 100%;
    ">
        {#each characters as {name, icon, value}, index(name)}
            <div id="${name}" class='generatedCharacter' style="
            margin:auto;
            padding-top: 1rem;
            ">
                <div>
                    <img 
                        src="{icon}" 
                        alt="icon of ${name}"
                        style="
                            height:6rem;
                            width:100%;
                            margin: auto;
                        "
                    />
                </div>
                <div style="width: 100%;">
                    <h4 
                        class="name"
                        style="
                        font-weight:bold; 
                        text-transform: uppercase; 
                        width: 100%; 
                        margin: auto; 
                        text-align: 
                        center;
                    ">
                        {name}
                    </h4>
                    <div style='
                        display:flex;   
                    '>
                        <div 
                            class="incrementButton minus"
                            role="button"
                            tabindex="0"
                            on:click={() => decrementValue(index)}
                            on:keypress={() => voidFunc()}
                        >
                            -
                        </div>
                        <div style="
                            margin: auto; 
                            width: 2em; 
                            text-align: center;
                        ">
                        {value}
                        </div>
                        <div 
                            class="incrementButton plus"
                            role="button"
                            on:click={() => incrementValue(index)}
                            tabindex="0"
                            on:keypress={() => voidFunc()}
                        >
                            +
                        </div>
                    </div>
                </div>
            </div>
        {/each}
    </div>
</div>

<style>
    .generatedCharacter {
        width: 128px;
        padding-top: 2rem;
    }
    .generatedCharacter:nth-child(even) {
        background-image: linear-gradient(-70deg, #111, #222);
        border-radius: 20px;
    }
    .name {
        height: 2rem;
    }
    .incrementButton {
        border-radius: 8px;
        margin: auto;
        text-align: center;
        min-height: 1em;
        min-width: 2em;
        text-align: center;
        vertical-align: middle;
        user-select: none;
        cursor: pointer;
    }
    .minus {
        background-color: darkred;
    }
        .minus:hover {
            background-color: red;
        }
    .plus {
        background-color: darkgreen;
    }
        .plus:hover {
            background-color: greenyellow;
        }
</style>

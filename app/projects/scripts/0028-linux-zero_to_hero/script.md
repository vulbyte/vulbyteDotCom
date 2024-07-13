# linux - zer0 to hero

> written by: [vulbyte](https://vulbyte.com/links)
> proofred and edited by: [vulbyte](https://vulbyte.com/links), & [bubbshalub](https://bubbshalub.com/links)

## part 0 | intro

okay, you want to switch to linux. either because you're:

- interested in a developer career, []()
- fed up with microsofts bs, []()
- want to try something new []()
- have a low spec system []()
- or heck, just want to play around with something new because you're bored []()

this video will get from beginner to not an expert, as being an expert will take years of experience that no single video can teach you, but to a point where you'll be able to competently be able to use linux and understand how to diagnose any issue you might have and solve your problems.

this video is _not_ meant to be a video where i will solve your problems and tell you every little thing you need to know, as that will massively differ on the person, hardware, and what operating system you chose.

what this video **_is_**, is a guide to get you to the point where you're not stuck in a tutorial hell with linux, and you can be truly independent.

this video is also a general howto, i will not be making any strong recommendations as doing so arguably agaisnt the spirit of linux, and as before, will massively differ based on your use case.

## part 1 | pre-requites:

if you want to make this transition to linux, i have 1 task for you before you move further.

    a. if you're on windows, look up the "chocolatey package manager"

    b. if you're on macOS, look up and install the "brew package manager"

then download an application with one of those 2 tools. a good recommendation if you don't have it already installed, is chromium as it's the open source version of chrome most don't already have installed.

i'll give you one tip for this, for the best results look up your package manager, then the package you wish to install such as:

> brew chromium

or

> chocolately chromium

### why must i do this, i just want to use linux!

good question! the issue is 2 fold. first being linux is different then windows and macOS, using these package managers you get a taste of one reason people really like linux, and at the time of writing these are 2 large stable community supported package managers.

it'll be important later

### but i heard with linux you can use a gui for everything! why do i need to bother with the terminal?

you're right, you can do ~95% of what you need to with a gui, but what about that other 5%? linux has a deep deep rooted history of using the terminal, and there's a very strong culture of using the terminal, so although the vast majority of what you do can be done with a gui. if you have any niche issue, or wanna do something even slightly off the beaten path you will commonly be pushed towards the terminal, so i feel like it's best to be semi comfortable before diving in.

if there's some post download issue, such as the app not launching then don't worry you can carry on, that was just a skillcheck, but if you "can't do it" or "it's too difficult" i mean this in the nicest way possible, **give up**.

it's fine if you can't! but if you're unable to do so, linux will not be a comfortable switch, and i strongly recommend oyu do not continue as everyone i've personally known who has issues with this part have 100% of the time switched back to windows.

BUBS: [reason why is because DE are all different, not 1:1 instructions]

the main reason why is because each DE (desktop enviornment) is different or tweaked, so if i were to give you any instructions then it would immediately turn this into a video telling you **what** to do instead of giving you the resources on how to solve your problem.

BUBS: [you need to learn linux, it is not windows or macos]

ontop of the DE being either different or heavily tweaked distro to distro, it's also important you learn your operating system, as linux is different then windows or macOS, so you will need to learn them. and anyone saying otherwise in my opinion is lying.

BUBS: [show the meme of the error message that tells you EXACTLY WHAT TO DO AND THEY DONT KNOW WHAT TO DO]
![image](https://pbs.twimg.com/media/GQiJskIXMAA5UAD?format=jpg&name=large)

this is the filter.

#### tip | learning to google

search engines are a genuinely amazing tool, if you are struggling or need help, a **search engine is your friend**. if you haven't been taught the best way to search, let me help you quickly!

the best way i've found to google is:

```bash
{subject}, {1 single question}
```

an example of this is:

```bash
chocolately, how to install
```

what this does is tell's the engine the important thing is your subject, so find results related to that first, then follow that up with your question.

this is what i like to call "decreasing specificity", although i massively prefer doing it give versa, with google i find it's massively better to flip the script.

#### warning | the "i" in "llm" is for intelligence

Although you might be tempted to use a tool like chatGPT, don't. ai is not rational, and commonly makes things up and hallucinates. although you might be tempted to use the tool, and it might even give you the right answer, long term it will only hurt you, your understanding, and if you're doing that then you should not bother with this video, as this video is for people who want to learn.

BUBS: [ChatGPT is last resort, know what commands actually do before executing them]

i've also had chatgpt send me on some WILD adventures only to find an easy one line solution elsewhere. i would say it's not bad for doing something like decyphering a command so you can learn what a command is before running it, but i personally would recommend you strongly avoid it

### physical needs

okay, assuming oyu did the previous part **which is important**, here's what you'll need to carry on:

- 2 usb-a sticks (also known as thumbdrives), of at least 16gb each, and is at least usb 2.0 or higher (3.0 or better is strongly recommended for later)
- a computer you are willing to install linux onto which has a drive you are willing to erase and lose all your data on

  > tip: if you have 2 drives on the system and they're similar, it would be best to open windows partition manager and note the exact name of the drive you're doing to overwrite (such as seagate819002a7)

with that completed, we can move on to actually getting started!

## part 2 | research

    "no battle was ever won according to plan, but no battle was ever won without one" - Dwight D. Eisenhower, 34th president of the usa

with the planned switch, it is very important to preplan as switching later will be tedius and annoying, and it's best to make your choice based on which works best for you.

so with that being said, what's the best approach?

the first thing i would recommend is applications, look over your entire stack and see if there's any apps you need to replace. as mentioned before i'm not going to make any strong recommendations as this is meant to be a guide not a tutorial, but an amazing resource i genuinely think needs more attention is: [alternativeto.net](https://www.alternativeto.net) here you can search essentially any application oyu use, and filter by linux and is paid or free.

please read the reviews as some programs cannot be 1:1 matches, so it's best to make sure that you can.

BUBS: [ProtonDB for games!!!]

### part 2.1 | test

after doing so, try the apps! if it exists on linux, it likely has a mac and or windows variant which you can try out! use these for a while, try genuinely replace your workflow with these alternatives. because if you cannot, and you attempt to switch, you will have more issues than an app not working.

i would strongly recommend on a piece of paper or an external device like your phone, you make a list of all the applications you want to download later, as i'll show you a neat trick to install them all later

another thing you'll want to do is find out if your system has a desognated gpu, and if so who is the gpu made by?
the options should be: nvidia, amd, or intel. and you can google how to do so for your system. this is important so go do that!

> please note: you will see some linux advocates suggesting you can emulate, use wine, use a vm, or something of the like to get your applications to run, i will personally say those have never been acceptable solutions to me, and have always been slow, buggy, unstable, or refuse to work, so i would not personally count on it.

BUBS: [please for the love of jimmy dont send people to OUR server for help]

> and hey, if you're enjoying the video and wanna see stuff i make in the future, checkout [vulbyte.com/links](https://vulbyte.com/links/)

### part 2.2 | finding your distro

next we need to find a distro you would like to switch too. but what is a distro? you can think of a distro as a package of various tools, applications, and the like that was built by a person or team that is meant to be installed on your system, a way to think of it is like white label'd products, where the linux kernal is the core product, then someone will create a "product" based on the linux core. though in a much less free ridey way (most of the time)

BUBS: [Show common distros on screen]

most distros tend to focus on a problem and solve that, then distros based off of distros generally attempt to create or extend functionality from said distro.

an example i will give (not suggestion as an endorsement) is ubuntu,
ubuntu is a linux distro based on another distro debian, which is build ontop of the linux kernal itself.

> linux kernal > debian > ubuntu

there's also ubuntu derivitives such as lubuntu which is based off ubuntu

> linux kernal > debian > ubuntu > lubuntu

please keep in mind as much as you might be tempted to choose a meme distro like "hannah montana linux", remember these things purpose is to be a joke, and likely aren't supported. with what i was saying about purpose, the purpose of these distros is to be a joke. and although you can make it work will likely be as comfortable as a chair made of cactus bark.

BUBS: [Kernel please, talk about common distros, flavors]
another thing to know is that a lot of distros have flavors which are either community made or are an official branch made by the official team. the gold standard for this in my opinion is manjaro, where if you go to their site you can see the main official versions made by the team, then listed just below those are all the community versions which use other popular but not directly supported desktop environments.

> > [https://manjaro.org/download/](https://manjaro.org/download/)

the reason i mention this is because let's say you really like the idea of say fedora linux, but you don't like gnome due to it's more intrusive ui, and you want something more windows like such as kde, you can then look up your distro plus the de you want, then you can find a derivative.

BUBS: [WSL is not linux]

##### important note! wsl is not linux!

something important to know, is thanks to windows being anti-competitive, here's one small asterisk. wsl (windows subsystem for linux) is NOT linux, what you'll have is a linux distro without a desktop enviornment, so this isn't very evocative of the vast majority of linux distros outside something extreme like arch.

#### important note

although your kneejerk might be to suggestion "oh, so lubuntu is worse then ubuntu because it builds off ubuntu, so it's going to be larger and slower", that's actually entirely incorrect!

lubuntu is actually meant to be a lighter weight easer to run varient of ubuntu, they do so by changing some default settings and removing some things that make ubuntu sluggish on slower hardware, while attempting to extend ubuntus features to slower hardware. so although intuitively lubuntu's origins might suggest it being slower and bloated, it's actually not!

BUBS: [Add DE here]
another thing to note is almost every popular distro has both a kde and gnome variant, so it is worth looking up!

another nother thing to note is most distros that look really nice are actually just using an icon pack, and you can make almost any distro look like any other, infact, kde has a tool built into the de which lets you browse and download new icon packs for whatever you want!

### part 2.3 | understanding the distro mess, and narrowing in

okay, but this is all so overwhelming! i need more help!

okay okay, i hear you and it's all good, let me give you a great resource and a tip.

#### the resource:

there's a site called (distrowatch.com)[https://distrowatch.com/] who's all purpose is to show you what distros are popular at the moment and give you tips on which ones you may or may not enjoy.

> warning!: although (distrowatch.com)[https://distrowatch.com/] is a good resource to feel out the landscape of distros, there are a few important things to note:

1. Popularity is not an endorsement of quality or compatibility. let's take an example such as a light distro being really popular at the moment such as tinycore. well there's a total possibility a developing country might have just got a bunch of "new" computers and windows is unbearably slow, or just didn't come with any os because all drives were removed and/or destoryed before hand. well this doesn't mean it's the right distro for oyu, just that it's the right distro for someone else or a group of people.
2. beware the "lite distros", although lite distros are good an important for many people, you likely don't need a light distro. these distros are generally meant for much old software that can't support the latest windows os or simply run too poorly on windows in the first place to bother running. if you have a system that was build within the last say 5 years and has a desognated gpu, you likely don't need a light distro, 5-10 you might depending on specs, and if your system is older then 10 years then it's definently worth considering a light distro.

BUBS: [performance issues on windows dont necessitate a lite distro]
i have witnessed a lot of people who use windows and have a terrible time, only to switch to linux and have their system feel like new, so it's best to not download one unless you're sure you need one

BUBS: [teach how to ID Nvidia/AMD/Intel GPU]

#### the tip:

Despite what some may want you to think, linux is actually massively held up and working by large companies also avoiding microsofts iron grip, so when choosing a distro, it's generally best to choose one that has some form of cooperate support somehwere in the branch, such as:

BUBS: [Microsoft also uses linux, and its a MAJOR part of their revenue for]
a thing you may actually be surprised to know is microsoft actually supports linux on a few fronts, and even lets their developers run ubuntu on site. so if you're worried about linux being too niche that's actually largely incorrect

- a debian based distro, such as: ubuntu or pop_os!, as debians stability has been widely known and ackknowledged and is a common choice for servers and gaming respectively

- a fedora based distro, such as: stock fedora, or nobara BUBS: [c:]

or last but certainly not least:

- an arch based distro, such as: manjaro, or endeavor

BUBS: [explain where canonical, system76 get money from]
an example of making sure the distro is supported is with:

- is ubuntu makes money by selling customer support for companies, extended support, and a few other things, which gives canonical (the maintainers of ubuntu) a direct incentive to maintain the os.
- a similar case is with the maintainers of pop_os!, where the maintainers (system76) sell systems that all come with pop_os! on it, giving them another reason to maintain and support pop_os!
- and fedora which up the tree is maintained by redhat which is owned by IBM, who makes and deploys servers with i recall something like 6 9's of uptime

reasons the reasons this is important being:
a. if you need to switch to another distro later you can easily take what you've learned and apply it to another, such as is you use manjaro for a while, you can easily take your skills their to say endeavor or even stock arch without needing to learn a new way of doing things
b. if your distro's maintainers decides to stop maintaining your project for whatever reason, you can easily migrate without reliance on said distro.

BUBS: [stay away from stock arch]
a small asterisk is if you're a new user, i would avoid arch, i know it's a meme and some will say it's fine, but if i find the added pain just isn't very worth the paint. i would recommend if you want to try arch use a nicher derivitive such as manjaro or endeavor as it smooths out a lot of the rough edges for you.

### "oh, but my distro won't go away!"

yes, it likely will, especally if you look at this image (here)[https://en.wikipedia.org/wiki/List_of_Linux_distributions#/media/File:Linux_Distribution_Timeline.svg], any line that isn't at the very end of the graph is a "dead distro", a distro which is no longer receiving any support. so this is why it's important to choose a distro with a foundation or company behind it, because that will minimize the risk of needing to start over (r.i.p. justin beiber linux)

BUBS: [Distro hopping is normal and fine]
a thing to be mindful of too, is it's not uncommon for people who want to try a veriety of distros to distro hop.
these people can actually make their user directory (sometimes called home directory or ~/ directory) a seperate partition so they can distro hop really easily, then just set the home folder to said partition. if you're interested in this it's outside the scope of this video, but feel free to search up "how ot make a home partition in linux" or something of that like!

### part 3 | are you really going to buy the car before you drive it?

okay, assuming you got this far and everything went okay, it's time to test drive! if you wanna dip your toe first you can look up a vm (virtual machine) and install it, then test your linux distro their. i will warn unless you enable a bunch of settings and do some bio's configuring the vm will likely run very slow. this is expected but it's still nice to poke around with a parachute before you take the dive. if you like the distro you tried, congradulations! if not feel free to poke around more. just remember everything you're doing is new so it will take some getting used ot and relearning.

after you gave the distro a little test drive, it's time to make a bootable thumb drive, just like they use to install windows,
the simplest way at the time of writing is use a os flasher such as: balenaEtcher or rufus to create a bootable flash drive.

after you make your bootable iso drive, here's something i strongly recommend, using your second drive, create an installable windows medium using "windows media creation tool".

#### !!!important!!!

if you do not create a windows installation before uninstalling windows, you **will not** beable to make one on linux. for whatever reason windows requires you to have access to a windows computer to make one, so you'll either need to use another computer to make one later, get a computer store to make one for you (when i tried long ago bestbuy quoted me 50$ to do so), or buy an official windows usb from somwhere like amazon for ~100$

BUBS: [prebuilt experiments are extremely inconsistant, off the shelf parts usually work just fine, mention your laptop hassle]

first you'll need a computer that you're willing to install linux onto, what i want to add as a quick warning is if you're using a prebuilt of sorts such as a dell optiplex or a laptop you'll have issues.

one example is when i first started trying to switch a while back in 2019, i had a "acer predator pro gaming" laptop, and it was a fine laptop, but acer did this really dumb thing where the laptops fans were controlled by their dumb software, making it so that my laptop would over heat because the fans simply wouldn't turn on then hard crash due to thermals turning the system off.

### part 4 | installing linux

#### important: before we begin, i strongly recommend backing up any and all data you are consider important or precious, and have a backup of it. as if you make a mistake here you could potentially loose all the data, so it's important to do so.

BUBS: [secure boot ywy]
another thing is disabling secure boot. if you have a custom system this likely is off, but doesn't hurt to check just incase. it's also important to note after disabling this, you're past a point of no return, as doing so sometimes throws away thge keys your system uses to secure boot, making your windows installation unbootable requiring a reinstall. and reinabling secure boot wont fix this!

if this is your first time please back up your data, and please don't think you'll be fine, as i have witnessed about 6/10 of the people i have helped install linux make this mistake.

BUBS: [google drive, onedrive, icloud, external drive from bestbuy]
that's why it's important to back up any data you care about. some options for this are: google drive, one drive, icloud, or buying an external drive for your data

okay, bootable mediums created, what now?

plug in your usb,

then you'll need to do is boot into your bios, if you're using a desktop you'll likely know how to do this using that message that comes up each time you start your system, if not you'll need to find the boot key for your device.

> tip
> you can hold the key when rebooting instead of mashing it, this is easier on your fingers and helps prevent your keys from wearing out.

BUBS: [teach how to find your mobo from windows menu]
commonly the key for this is actually pared with your mobo as thats where the bios chip is, what you can do if you're on windows is look up: "how to find mother board model windows", then look up how to access bios on said motherboard model if you can't find any quick or clear resutls.

once you do so, you'll need to select change your boot priority to be your thumb drive. this is unique to each motherboard, but is generally in a boot menu under a setting labeled "boot priority" or the like.

after you do so then feel free to reboot and you should see some unfamiliar things happen, don't be complacent as you'll likely see by surprise a pop up menu with a timer. generally the options are something like what follows:

- try {distro}
- boot into distro (open source drivers) - generally the best option
- boot into distro (nvidia/nonfree drivers) - best option if you have an nvidia gpu
- install
- safe boot
- manual

and some others, with all of the above or none in whatever order the os decides. you generally want to boot into the distro with whatever option is relevant to your system, if you don't know it is generally better to boot into the open source drivers, though it will require more effort later as the nvidia drivers at the time of writing are often are needed for various tools and utils, while amd generally works out the box with a few exceptions such as gpu acceleration with blenders cycle engine on certain engines.

after a bit more time it should begin booting, if you did the vm step you'll notice this is very similar to the vm, if you didn't/couldn't, no worries. feel free to poke around now some more and play around, but note 2 things:

1. nothing here will be saved, even if you reboot back into the usb, reinstall, or what have you nothing will save, so don't start installing apps unless you simply wish to test them.

2. everything here is actaully running off your usb, so it's important to know this isn't a 1:1 of the post installation, and i often find the fps (frames per second) of your monitor is 1/4 the fps post install (on average).

BUBS: [might be worth it to buy higher end usb for this part]

if after some more poking around/testing you seem happy, wonderful! let's get to installing!

#### note: the "windows key" or "cmd" key on linux is called the "super" or "meta" key on linux. so `win+f` == `cmd+f` == `super+f`

traditionally, on the vast majority of distros:

- if you're not using a distro with a window manager: press `super` and search for `install`
- if you are, it varies based on manager, but the most common i3, you press super+space, then search for install

after this, you'll need to walk through the options presented.

BUBS: [make password easy to type as it will be done a LOT]

> note: another thing, is this password is basically just for local usage, so you don't need to worry much about making it overly secure, generally a 6 digit pin or what have you is fine. if you're worried about security obviously make it as long as you like, but this is purely a password for local things

simply work through the prompts, but know 2 things:

1. the first thing is you need to know is for your sake please don't set a dumb/silly username, as to change it later is a pain.
2. the next thing is, if you're presented with the options:

```
    no swap
    swap (no hibernate)
    swap (with hibernate)
    swap to file
```

BUBS: [this is where the drive ID renaming from earlier comes in clutch]

> while you're setting up your system, this is where your drive id you got earlier comes in clutch

BUBS: [please use EXT4]

> another thing to note is if you're presented with what file system to use, ext4 is widly considered the best at the time of writing

i recommend swap with hibernate, as i have personally noticed that swap with hybernate is the most stable with all the people i have personally helped.

> please note, this is over about 10 people, which is an incredibly small sample size, so please do your research and see what people prefer largely, however in 8/10 cases i have noticed that to be the most stable. but if you find your system is still unstable after install reinstalling with swap may be better for you/your system

after working through the presented menu, you should see something "please unplug usb and reboot", if you're just given the option to reboot, then simply unplug the usb after your screen goes black.

#### issue: no boot/booted back into windows/no install

if you didn't boot into linux after rebooting, you have 1 of three issues:

1. you installed beside windows instead of over windows. the data on that drive is now likely lost if there was any on it, however you're now dual booting, so congradulations! (silver linings)
2. your system didn't decent the new boot drive, in the bios simply change the boot from your usb, "n/a" or the wrong boot medium to the correct one and your issue should be solved
3. the install failed, and you'll need to try again (least likely)

BUBS: [while doing this also show you setting up manjaro as an example]

### part 5 | post install

once you've finished installing, congratulations! you're now a linux user! BUBS: [I use arch btw, include arch dorito man] you effectively have 3 options at this point:

1. continue listening to what i have to say as i can save you a bunch of time
2. you can go learn on your own and go have your own artistic adventure
3. like, subscribe, bell c: because you found this video helpful so far

...

did everyone who wanted to leave leave? okay cool, now this is where i'll share you some linux guru stuff

first, you may notice there's an app store of sort depending on your distro, these can work but are often clammered with poor choices (such as with ubuntu how they try really hard to force you to use snaps and not use flatpak (at the time of writing)) or what have you. so how do we fix this?

with 2 package managers! open up your terminal, or console (sometime spelt "konsole"), and this is where we get to really strech our legs.

#### part 5.1 | mini terminal tutorial

as mentioned before, linux has a deep seeded history and culture of using the terminal, and this is where we'll learn! i'll keep it as simple as possible as this is a beginner tutorial and i don't want to overwhelm anyone.

your terminal is an interface between you and your system, and you can use it to do almost anything you can think of.

just like how in the beginning of this video you installed chocolatey and installed chromium (or brew if on mac), linux is very similar, though i never properly explained how it works, so as someone who's made a few cli's (command line interface) tools, let's work through a universal command!

```bash
sudo mkdir -p ~/path/to/dir
```

the above command will be broken into 4 parts,

1. privileges
   > in this case "sudo"
   > BUBS: [it will ask for pswd]
2. the command
   > in this case "mkdir"
3. flags
   > in this case "-p"
4. args (arguments)
   > in this case "~/path/to/dir/"

so what does all this mean? let's break it down.

the first part, "sudo" stands for **su**per-user **do**. this is linux's version of admin, and let's you preform operations at an elevated security level.

mkdir is a command buried somewhere on your system, which has been linked to your terminal via a config file somewhere. what it is in this case is **m**a**k**e **dir**ectory, which is effectively synonymous with "folder". after using linux for over 5 years i still use the terms interchangeably.

the next part "-p" is a flag, what this does is it tells the program "hey, what you're about to do, do this while you do your main thing". flags are unique to each application so you'll need to learn the flags for each program.
with the case of mkdir, the -p flag tells mkdir to work in "path-mode", means means if a directory/folder between the beginning and the end of the file don't exist, just add those directories.

> we can look at this as: if in the example `~/path/to/dir/` to path "~/path/", "~/path/to/", or "~/path/to/dir" doesn't exist, create it.
>
> if we didn't have the -p flag and say the directory: "~/path/to/" didn't exist, then we would get an error like:

```bash
zsh: no such file or directory: /Users/vulbyte/path/to/
```

the last option here is an argument in the form of a string (a string just being a bunch of characters and or numbers in a row). stringing these together we quickly build a complete arguement and mkdir will take over and do whatever it needs to to make the desired directory for us

##### please note: not all commands are like this, although sudo and the program name will effectively always be in that order, the flags and arguments may be in some other random order such as: `{command} {arg1} {arg1_option1, arg1_option2} {arg2} {arg1_option1}` or `{priv} {command} {arg1, 2, 3} {options: 1, 2, 3} or whatever order the creator chose

now here's where we can add something cool: we can string commands together, seperating them with a ";",

so you can do something like `{command to update system}; reboot` to update, then reboot your system without needing to sit around waiting for the update to finish.

if you get really into terminal commands you can even do things called piping, where you take the outputs of one command, and pass it into another command, so you can effectively do mini-programming!
with a basic understand of how terminal commands work

BUBS: [yaka juice (yakuane terminal is a neat thing)]

##### fun fact: a lot of commands on your system like update and reboot are just terminal commands! the gui button you click is effectively just a visual button that runs a terminal command for you

#### part 5.2 | carrying on

if you chose a non-niche distro, you'll have 1 of 3 package managers depending on what you chose:

```bash
    apt for a debian base,
    pacman for an arch base,
    dnf for a fedora base
```

and with this, you should learn 3 important things:

1. how to update your system
2. how to install apps
3. how to remove apps

but that's only one package manager, where's the other you mentioned?

well the other is flatpak! just like how you can't expect to run macOS apps on windows and vise versa, linux distros are often similar, however, flatpak attempts to fix this. you can check if flatpak is on your system with a simple command:

BUBS: [linux is in process of switching to a universal standard, flatpak is the start of that]

```bash
flatpak --version
```

if you get a value returned like:

```bash
cmd not found: 'flatpak --version'
```

that means it isn't installed, so go look up how to install it just like brew or chocolaty (told you knowing how to install a package manager would be important later).

after you've installed flatpak, you might be wondering _why?_

well, here's why, using package managers such as `apt, pacman, or dnf` are _fine_, but generally have a cluster of issues that can be avoided if they don't need to be low level.

unless your application is something like: Steam, a game, an app that needs your gpu like your webbrowser, or some other application where performance is important like a DAW, you don't need to deal with the pain of using these package managers and the conflicts they may cause, which is where flatpak comes in.

although many people wil detest flatpak for one reason or anther, i personally think it's safer to use flatpaks until you find a reason not too, instead of vise versa. as flatpak often takes care of a lot of annoying things liek dependancies and sandboxing for you, and if you don't really know or understand what those are, point proven.

BUBS: [explain what flathub is]

> but how will you look for apps?
> flatpak to oversimplify connects to a database you can browse at [flathub.org](https://flathub.org) to easily find apps which work on effectively every linux distro out their.

> but how to i use it?

so after you installed flatpak, let's download a couple core apps for you!

let's do something simple for now: let's install 3 apps you probably use (if not, feel free to swap with apps you personally use)

using flatpak, let's run the command:

```bash
flatpak install qpwgraph flatseal obs-studio
```

flatpak will then look for these programs and install the best option, if no best option exists it'll simply ask you or fail.

BUBS: [explain what flatseal is]
i'll skip over obs as it's widly documented, but i'll explain the other 2 as i consider them linux essentials!
flatseal is a an application which lets you easily change and manage permissions for any apps you install which can let you easily troubleshoot or get some performance gains by say enabling gpu access if you so desire

#### note: these are just search terms for flatpak to search for. a direct download of a specific package looks something like: `flatpak install flathub com.obsproject.Studio`, which will download a specific obs package from flathub

flatpak will prompt you while installing these so just read the output and choose what you think is best. it never hurts to look up the app if you're not sure.

given however much time it takes to run, you can now type: `super + {app name}` to run the applications you want, or just click them if you see them pop up in your menu.

and that's it! outside a few niche things like updating your graphic driver you're set!

### part 6 | outro

and with that you're now a linux user! you have a good idea of how to do things, what to do if something goes wrong, and how to use the terminal if you need/want too. if you're a streamer maybe check out this video where i show you how to get some overpowered audio that is better then anything windows or macOS has, and will make editing your streams in post a breeze!

BUBS: [invite linux users to help in comments, also invite questions to comments section]
got a question? feel free to post in the comments or on a form somewhere!
and if you're a linux user watching this for fun, or what have you, try help some people out! linux will only be better the more people use it!

if you found the video helpful please do the generic youtuber stuff of liking and subscribing and i'll see you all later!

# 0027 - jpeg vs png

## intro

Every while i commonly hear some generic uninformed garbase being passed around.
"use png because it has alphas!"
"pngs make my drawings look so much better!"
"my image looks bad :c"
"pngs are a have so much more data!"

i'm going to just lay this out here; as sasinctly as possible, and share how and where you should use each.

## intro to jargan

so this is something i want to quickly get out of the way so people can be upto speed quickly, so i'm just going to cover 4 quick important terms before we move one.

Data Sizes
: data sizes are relatively simple let complex. this isn't meant to be a data comprehensive guide to data storage (tho i can totally do that if you're interested, comment to let me know). however with that being said this is all you need to know
byte is a form of data, if there is no prefix then it's as small as it can be. kilo meaning "thousand" in greek. mega meaning "million". and "giga" meaning billion. so if i say "21 gigibytes", take 21, and times it my 1 million. i won't be giving extremely high percision numbers as it largely won't be relivant.

Compression
: compression is the act of taking something and making it smaller. in this case data. as a brief example let's say we have an image of red and white. red to a computer generally looks something like "#ff0000" and white generally looks like "#ffffff". well because the image only uses these 2 colors, we can saw give the red a value of "r", and the white a value of "w". and then each pixel can simply reference the color. meaning that outside a little extra data, every pixel takes up only 1 character of data instead of 6, so we reduced each pixels data by 5/6th! (this isn't actually how it works, and there's a lot more that goes on and it's a lot more complicated then this, this is just a very abstract exmaple of it to catch everyone up)

Algorithm
: an algorithm is long story short a mathmatical formula that takes in inputs, and returns outputssssss. an example if let's say you have an input, which in this case will be x, the formula is *2, then we have a really simple algorithm of x*2. so if x=1 then we return 2, if x=2 then we return 4, and if x=3 then we return 6. so why the micro algebra class? because when you have a flawless image, then select "export as" then you end up a running an algorithm that will output the format you selected.

vector
: a vector has many different terms in many different fields. in this context to oversimplify a vector is a mathmatical set of paths that creates shapes, which can make up an image. the general file format for these is a svg ["scalable vector graphic"]

Raster
: in this context a raster mean to turn something into from some format into an image of pixels (not pixels in the physical rgb way, but just squares of color). so by extent the term "rasterize" means "to turn into a raster image.

## JPEG overview

jpegs stand for "joint photographic experts group". it's also important to know that jpeg and jpg are the same format.

it is a raster format that is a tile based format. !(raster tile grid provided by free code camp)[https://cdn-media-1.freecodecamp.org/images/U9kFCMBRjEh8szwttgD2Da8wCMNFYFgRZm9d] (image by freeCodeCamp)[https://www.freecodecamp.org/news/how-jpg-works-a4dbd2316f35/].

this is a massive oversimplification (seems to be the theme of this video) but what it does is it turns takes sections of the image and attempts to match it to the closest tile. similar to the compression example definition, jpeg will cut things into tiles which can be much easier to compress, then provide a couple colors to each tile to make it work.

depending on the compression level these tiles can be larger or smaller, with more or less color levels.

### jpeg xl

recently the jpeg foundation released a "jpegxl" format. this format however is different with a different algorithm, from my quick test jpegxl attempts to be much more "lossless", however it is different with much larger file sizes so i won't be talking about jpegxl.

## PNG (pronounced ping)

the ("ping")[https://www.w3.org/TR/2003/REC-PNG-20031110/#1Scope] format, standing for "photo network graphic", is an image format that is aften adored and loved by the internet; for many a good reason. it uses a "lossless" compression to compress images. it attempts to do pixel by pixel matching 1 to 1.

there's not a tonne to say, and i would rather talk about that with

## PNG VS JPEG

okay, so quick introduction out of the way, let's quickly put the images through a stress test.

i will be testing each image at 4 different compression/quality levels:

100%, 85%, 50%, and lastly 0%. the reason for me doing so is that i know these algorithms generally have a deminishing return, so i want to have the scale that is similar to a logarithmic scale (exponential growth for those who don't know) as i suspect the demands from 100% to 85% will be roughly equal to the difference between 85% and 50%. and although i don't expect 0% to have a usable result outside deepfried memes, it doesn't hurt to have a laugh.

each will also be in 8 bit color depth, if you don't know what that means don't worry. just know it isn't the best, but i wanted the tests to be consistent so that's what i chose.

each image will also be exported twice to ensure consistency, as each images export shouldn't have a margin of error more then a few percent. though it will differ slightly due to metadatas and the like.

if i have an inconsistent result i will take measures to ensure the results are consistent.

## testing each format

i conducted 4 tests that i will be using to test tech result.

(imma adlib the rest)

### TEST 1 | rainbow

### TEST 2 | sharp shapes

### TEST 3 | digital painting

### TEST 4 | 3d render

## results

## conclusion

### jpeg pros:

- can compress really

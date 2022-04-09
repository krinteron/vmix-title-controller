# vMix Title Controller

vMix Title Controller is an app for overlaying vMix titles into video streams.


## Features

The app has several modules for title control:

- four window unit (multiview);
- two window unit (multiview);
- telephone speaker;
- module with hotkeys (without text entry);
- universal table.

You can create your own sets of modules and move them around as you wish.  
The app works with vMix through the official vMix API and keeps track of its status.  
You can set each module or title to the overlay number you want.  
To prevent overlapping layers, modules located on the same overlay will disable each other.  
You can also enable automatic upper/lower case conversion and title auto-closing with a 10 second timeout.  
Hotkeys have settable colors and names for better highlighting.  
The hash symbol `#` is used to separate text blocks of the same title (`Text1`, `Text2`).  


## Preparing environment

You need to install node.js
https://nodejs.org/en/download/

Next, you need to clone or download this repository.

Change the authorization data in the `.env` file for smb connection to the vMix network folder.  
You can host the vMix and this app on the same computer.  

Also, in the file `server/DB/vmixHost.json`, specify the actual address of the computer with vMix.  
You can also specify it in the user interface in the browser.  

![alt tag](https://64.media.tumblr.com/97862ebd86825aa15cdd8b5266aec1fa/2204300f6b8a81af-c8/s540x810/ca0fdacb2ca8e52a1364efa009a3c89778edfadd.png 'enter vmix ip')


## Getting started

The system running vMix must have a shared network folder with the following structure:
- vmix_store
  - hrip_photo
  - titles

The `hrip_photo` folder is for speakers photos when titling a phone call.  
The `titles` folder contains title files that can be loaded into vMix.  

Title files must be prepared in `vMix GT Title Designer` as follows:
- Text blocks to be modified named in format: `Text1`, `Text2`...
- Images named in format: `Image1`, `Image2`...
- Text in titles that is not intended to be changed must be named differently, and not have line breaks.
  For long sentences, create multiple blocks of text line by line.


![alt tag](https://64.media.tumblr.com/ac90d47944a4346b6f7c1554ae3f5685/2204300f6b8a81af-6a/s250x400/d71b2a296132cba3c419ede94599ba41c0b9c397.png 'title naming')​ ![alt tag](https://64.media.tumblr.com/6848c259f95e19edc86cba70f1b4a138/2204300f6b8a81af-9f/s250x400/55a2dc79144af8b548b027fa90f94f46fb5e91c2.png 'title naming')​​


## Start

Via the command line, go to the directory with the title controller.  
Enter commands:
```bash
npm install
npm run build
npm run start
```
Done, you can now open http://localhost:8000/ in the browser.

*Don't close the command line

*After all, you can also write a BAT file to automatically start the application
Something like:
```bash
cd "C:\path_to_projectdir"
npm run start
```

## Work example

https://user-images.githubusercontent.com/24290554/154822651-c91ea091-c1f1-40f2-85c3-c3448a382e4d.mp4

## Example of creating a new tab

https://user-images.githubusercontent.com/24290554/154822653-93b29460-1429-48f9-afc8-fadc992dbfc2.mp4
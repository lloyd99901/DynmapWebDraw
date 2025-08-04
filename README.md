# 🗺️DynmapWebDraw
DynmapWebDraw is a two-script system designed to help you draw areas within Minecraft using Dynmap's web interface and then automatically input these coordinates into your server terminal. This tool is ideal for automating map borders.
### Components 

1. **JavaScript Script**: 
   - Runs within the Dynmap web interface.
   - Allows you to draw custom areas, collect their coordinates, and save them to a file.

2. **AutoHotkey (AHK) Script**:
   - Reads the saved coordinates from the file.
   - Automatically inputs these coordinates into the Minecraft server terminal.

## Step-by-Step Instructions 📖

### Stage 1:

1. **🗺️ Access Dynmap Web Interface**:
   - Open your Minecraft world with Dynmap installed.
   - Navigate to the web interface provided by Dynmap.

2. **📝 Open Developer Console**:
   - For **Windows** or **Linux**, press `Ctrl + Shift + I` (or `Ctrl + Alt + I` in some browsers) to open the developer console within your web browser.
   - For **macOS**, use `Cmd + Opt + I`.

3. **🔃 Load JavaScript Script**:
   - Download the contents of this GitHub project.
   - Copy and paste the **contents** of the Stage 1 Dynmap Script JavaScript file into the developer console.
   - Press `Enter` to execute the command.
   - Please keep the developer console open, as this will notify you if there are errors.

5. **✏️ Draw Your Area**:
   - Once the script is loaded, you'll see a confirmation message: "DynmapWebDraw | ✅ Loaded script."
   - Click on the Dynmap again to focus it, hover over the first corner of your desired area with your mouse cursor and press the `X` key to save that coordinate. You should hear a short beep, indicating it has saved that coordinate. Press F1 for help.
   - Repeat this for each corner of your desired area.

6. **💾 Save Coordinates**:
   - After marking all corners, press `W` to save the collected coordinates to a file.
   - Depending on your browser settings, you may be prompted to save the file or it will automatically download to your Downloads folder.

### Stage 2: Using the AutoHotkey Script

1. **📩 Install AutoHotkey**:
   - Ensure you have AutoHotkey version 2.0.19 or later installed on your system.
   - If you haven't, download and install from [AutoHotkey's official website](https://www.autohotkey.com/).

2. **🗒️ Run the AHK Script**:
   - Locate and double-click the Stage 2 AutoHotkey script (e.g., `Stage 2 - Import to Server Terminal.ahk`).
   - The script will prompt you to open the coordinates file. Select that.
   - The script will then ask you to select the Minecraft server terminal and press the enter key, or escape if you want to abort. Please read the warnings below before continuing.

3. **🗃️ Input Coordinates**:
   - Once you press `Enter`, The AHK script will automatically type each coordinate into the server terminal, one at a time, with brief delays between inputs to prevent overwhelming the server.

4. **✅ Completion Message**:
   - After all coordinates have been successfully entered, you'll receive a message indicating completion.
   - You can then use these coordinates in the Minecraft server terminal to create your desired area using the `/dmarker addarea` command.


### ℹ️ Important Warnings and Considerations

>[!WARNING]
>**Console Input Caution**:
>- Ensure that you have selected the correct window (Minecraft server terminal) before the AHK begins inputting the coordinates in.
>- Depending on the amount of coordinates to enter, this may take awhile.
>- Avoid switching windows or performing other tasks until the script completes, as this can and **will** lead to unintended actions or errors.

>[!NOTE]
>**Server Load Management**:
>- Although delays are included in the script, monitor your server's performance during and after coordinate input.
>- Excessive rapid input may still strain server resources, so adjust the delay settings if necessary (refer to the script's documentation for instructions).

### 🔧 Troubleshooting Common Issues

1. **JavaScript Script Not Loading**:
   - Ensure that your browser allows loading scripts from local files.

2. **AHK Script Fails to Load Coordinates File**:
   - Check if the coordinates file was saved in the expected location.
   - Ensure that the script's file path is correctly pointing to your saved coordinates.

3. **Coordinates Not Entered Correctly**:
   - Confirm that you have selected the correct Minecraft server terminal window before starting the AHK script.
   - Verify that the coordinates file contains valid data and is formatted correctly.
  
### 📝 Customization Options

- **Keyboard Shortcuts**: 
  - The default shortcuts are `X` for marking corners and `W` for saving, among other keys. You can modify these in the JavaScript script to suit your preferences.

- **Delay Settings**:
  - Adjust the delay between coordinate inputs in the AHK script to manage server load effectively. This is typically done within the script's code, so familiarity with scripting may be required. You may also change the world type and server command in general by editing the 'msg' variable.
    `msg := "dmarker addcorner " . parts[1] . " " . parts[2] . " " . parts[3] . " world"`


## 🖥️ Requirements 

- Dynmap: Must be installed and properly configured on your Minecraft server.
- AutoHotkey Installation: The AHK script requires AutoHotkey (at least 2.0.19) to be installed on your system.

## Contributing 

Contributions are welcome! If you encounter issues, have suggestions, or wish to improve the project, please: 

- Fork the repository.
- Create an issue for any problems you face.
- Submit a pull request with your changes.

## License 
This project is licensed under the MIT License.
     

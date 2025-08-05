; STAGE 2 - DynmapWebDraw
; This script will import the finished coordinates from stage 1 into the server terminal.
; MIT License
; Copyright (c) 2025 Lunar
; Permission is hereby granted, free of charge, to any person obtaining a copy
; of this software and associated documentation files (the "Software"), to deal
; in the Software without restriction, including without limitation the rights
; to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
; copies of the Software, and to permit persons to whom the Software is
; furnished to do so, subject to the following conditions:
; The above copyright notice and this permission notice shall be included in all
; copies or substantial portions of the Software.
; THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
; IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
; FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
; AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
; LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
; OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
; SOFTWARE.
#Requires AutoHotkey v2.0
MsgBox "Step 1: Welcome to Stage 2 of DynWebDrawer (MIT License).`n`nYou will now be prompted to select a coordinate file exported in Stage 1 (called 'dynmap_coords.txt').`nIf you don't have this file, click Cancel in the open file dialog to exit."

; Open a file dialog for the user to select the coordinate file
filePath := FileSelect(1, "", "Select Coordinate File", "Text Documents (*.txt)")

if filePath = "" {
    MsgBox "No file has been selected. Exiting..."
    ExitApp
}

try{
    ; Read the file
    CoordinateFile := FileOpen(filePath, "r")
    if !IsObject(file) {
        MsgBox "Failed to open the coordinate file. Please check the path or file permissions. Exiting..."
        ExitApp
    }
    content := CoordinateFile.Read()
    CoordinateFile.Close()

    ; Split the content into lines and validate each line
    coords := StrSplit(content, "`n")

 for lineNum, coord in coords {
        coord := Trim(coord)
        if coord = ""
            continue

        parts := StrSplit(coord, ",")  ; Assuming CSV format: x,y,z

        if parts.Length != 3 {
            MsgBox "Exiting due to invalid coordinate format on line " lineNum ":`n" coord
            ExitApp
        }

        for _, part in parts {
            if !IsNumber(Trim(part)) {
                MsgBox "Exiting due to invalid number found in line " lineNum ":`n" coord
                ExitApp
            }
        }
    }

    MsgBox "Step 2: Now, when you press OK on this message box, please bring your Minecraft server terminal window into focus.`nWhen done, press ENTER to allow AHK to send the coordinates.`n`nIf you wish to exit, click OK on this message and press ESCAPE to cancel. `n⚠️ Once you press enter, avoid switching windows or performing other tasks until the script completes, as this can and will lead to unintended actions or errors. Please refer to the DynmapWebDraw GitHub readme for more information."


    ih := InputHook("L1")
    ih.KeyOpt("{Enter}", "E")
    ih.KeyOpt("{Escape}", "E")
    ih.Start()
    ih.Wait()

    if ih.EndKey = "Escape" {
        MsgBox "Operation cancelled by user. Exiting..."
        ExitApp
    }

    for i, coord in coords {
        coord := Trim(coord)
        if coord = ""
            continue  ; Skip empty lines

        parts := StrSplit(coord, ",")
        msg := "dmarker addcorner " . parts[1] . " " . parts[2] . " " . parts[3] . " world"

        ; Show progress tooltip
        ToolTip "📌 Sending coordinate " i " of " coords.Length

        ; Send the command
        Send msg
        Send "{Enter}"

        Sleep 50
    }

    ToolTip  ; Clears the tooltip when done

    MsgBox "✅ All coordinates have been sent!`n`nYou can now create the area using:`n/dmarker addarea <id> <label> . Exiting script..."
    ExitApp
} catch as e {
    MsgBox "⚠️ Exiting due to an error being thrown after loading the file. `n" e.Message
    ExitApp
}


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
MsgBox "This is the second stage of DynWebDrawer. Please select the coordinate file. If you do not have this file, please click cancel when the OpenFileDialog appears."

; Open a file dialog for the user to select the coordinate file
filePath := FileSelect(1, "", "Select Coordinate File", "Text Documents (*.txt)")

if filePath != "" {
        ; Read the content of the selected file
        CoordinateFile := FileOpen(filePath, "r")
        if !IsObject(file) {
            MsgBox "Failed to open file."
            ExitApp
        }
        content := CoordinateFile.Read()
        CoordinateFile.Close()

        ; Split the content into lines and validate each line
        coords := StrSplit(content, "`n")

        for _, coord in coords {
            if Trim(coord) == "" 
                continue  ; Skip empty lines

            ; Split the line into x, y, z coordinates
            parts := StrSplit(coord, ",")

            if parts.Length != 3 {
                throw Error("Invalid coordinate format: " coord)
            }

            for _, part in parts {
                if !IsNumber(Trim(part)) {
                    throw Error("Invalid number in coordinate: " part)
                }
            }
        }

        MsgBox "Please select your Minecraft server terminal window and press the enter key to for this script to enter the coordinates in OR press escape to abort. WARNING! Do not do select any other window during the entering of the coordinate data!"
        
        ih := InputHook("L1")
        ih.KeyOpt("{Enter}", "E")
        ih.KeyOpt("{Escape}", "E")
        ih.Start()
        ih.Wait()

        if ih.EndKey = "Escape" {
            MsgBox "Operation cancelled by user. Exiting..."
            ExitApp
        }

        for _, coord in coords {
            if Trim(coord) == "" 
                continue  ; Skip empty lines

            parts := StrSplit(coord, ",")
            msg := "dmarker addcorner " . parts[1] . " " . parts[2] . " " . parts[3] . " world"

            Send msg
            Send "{Enter}"
            Sleep 50
            ; Sleep 1000 ; Delay, we don't want to overwhelm the server now, do we?
            ; MsgBox "STOP"
        }

        MsgBox "Done! You can now use the following command to create the area:`n/dmarker addarea <id> <label>"
} else {
    MsgBox "No file selected. Closing..."
}

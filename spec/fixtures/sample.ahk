; An AutoHotkey v2 sample, kept idiomatic so it is worth opening in the editor.

#Requires AutoHotkey v2.0
#SingleInstance Force

/*
 * A block comment.
 */

Persistent
SetTitleMatchMode "RegEx"

MAX_RETRIES := 3
appName     := "Sample"
paths       := ["C:\Windows", A_MyDocuments, A_ScriptDir]
config      := Map("host", "localhost", "port", 8080)

/**
 * A documentation comment.
 * @param {String} name the name to greet
 * @returns {String} the greeting
 */
Greet(name, greeting := "Hello") {
    return Format("{1}, {2}!", greeting, name)
}

class Shape {
    static count := 0

    __New(name, sides := 0) {
        this.name := name
        this.sides := sides
        Shape.count += 1
    }

    Area => 0

    ToString() {
        return this.name . " (" . this.sides . " sides)"
    }
}

class Rectangle extends Shape {
    __New(width, height) {
        super.__New("rectangle", 4)
        this.width := width
        this.height := height
    }

    Area => this.width * this.height
}

square := Rectangle(3, 3)

if (square.Area > 10) {
    MsgBox Greet(appName), "Large", "Iconi"
} else if square.Area = 9 {
    MsgBox "exactly nine"
} else {
    MsgBox "small"
}

Loop paths.Length {
    path := paths[A_Index]
    if !DirExist(path)
        continue
    OutputDebug path "`n"
}

for key, value in config
    OutputDebug key "=" value "`n"

while (MAX_RETRIES > 0) {
    MAX_RETRIES--
    Sleep 100
}

try {
    FileRead("missing.txt")
} catch OSError as err {
    OutputDebug err.Message
} finally {
    OutputDebug "done"
}

; Hotkeys and hotstrings.
^!s::Send "{Text}saved"

#HotIf WinActive("ahk_exe lumine.exe")
F1:: {
    MsgBox "Lumine is focused"
}
#HotIf

::btw::by the way

ExitApp

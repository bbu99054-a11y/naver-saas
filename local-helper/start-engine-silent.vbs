Set objShell = CreateObject("WScript.Shell")
Set objFSO = CreateObject("Scripting.FileSystemObject")
strCurDir = objFSO.GetParentFolderName(WScript.ScriptFullName)
objShell.CurrentDirectory = strCurDir
' 0 = Hide window (완전 무음 백그라운드 실행)
objShell.Run "cmd.exe /c node server.js", 0, False

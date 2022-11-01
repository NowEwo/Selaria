import subprocess
import websockets
import hashlib
import asyncio
import json
import os

Password = "8540f7c0e8fe04febd16b8422c675691"

async def handler(websocket, path):
    data = await websocket.recv()
    Data = json.loads(data)
    if(hashlib.md5(Data["Credential"].encode()).hexdigest() != Password):
        Reply = json.dumps({"Statut":3,"Reply":"Invalid credentials"})
        await websocket.send(Reply)
    else:
        if(Data["Action"] == "ExecuteCommand"):
            p = subprocess.Popen(Data["Command"], stdout=subprocess.PIPE, stderr=subprocess.IGNORE)
            Text = p.stdout.read()
            RetCode = p.wait()
            Reply = json.dumps({"Statut":1,"Reply":Text,"CommandReturnCode":RetCode})
            await websocket.send(Reply)
        else:
            Reply = json.dumps({"Statut":2,"Reply":"Unknown action"})
            await websocket.send(Reply)

start_server = websockets.serve(handler, "localhost", 1395)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
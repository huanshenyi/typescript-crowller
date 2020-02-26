# 初期化

```
npm init -Y
tsc --init
npm install ts-node -D
npm install typescript -D

# ライトのhttpライブラリ
npm install superagent --save
npm install @types/superagent -D
```

# html解析ライブラリ
```
npm install cheerio --save
npm install @types/cheerio
```

# 自動build

```
 "scripts": {
    "build": "tsc -w"
  },
```

# 自動実行
npm install nodemon -D
```
"scripts": {
    "start": "nodemon node ./build/crowller.js"
  },
// 監視から外すファイル  
"nodemonConfig":{
    "ignore": ["test/*", "docs/*"],
  },
```

# 更に便利

```
npm install concurrently -D
```

```
  "scripts": {
    "dev:build": "tsc -w",
    "dev:start": "nodemon node ./build/crowller.js",
    "dev": "concurrently npm:dev:*"
  },
```
# typescriptでexpressの使用関連

req.bodyからデータ取れるために
```
npm install body-parser --save
```
ドキュメント: https://github.com/expressjs/body-parser
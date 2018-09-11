# Sandbox / React Simple

手元でシンプルにReact.js のコードをテストするためのベースコード。

### 起動

```
npm run start
```

### proxy

以下のようにするとプロキシとして動作する。URLなどをある程度書き換える。

```
/proxy?url=http://example.com
```

### for SPA

存在しないURLをリクエストすると index.html の内容をフォールバックする。

```
/not_found.html
```


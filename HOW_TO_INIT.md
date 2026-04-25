# for Cloud Functions Apps

```
# submodule
git submodule add git@github.com:yananob/cloud-functions-common _cf-common
git submodule add git@github.com:yananob/_template _template
```

## GitHub actionでのデプロイ

1. 以下見る https://console.cloud.google.com/projectselector2/iam-admin/serviceaccounts?hl=ja&inv=1&invt=Abzjyw&supportedpurview=project
2. 既存のリポジトリの内容を参考に、同じように追加する
    - Cloud Run Deployer SAに、既存のプリンシプル〜タブで追加する
コマンドでもできるはずだが、エラーになるので、上記GUIでの設定にしている

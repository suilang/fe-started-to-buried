# Yarn错误集合

## yarn link error message is not helpful

Running link for a linked package shows:

```
warning There's already a package called "vega" registered. This command has had no effect. If this command was run in another folder with the same name, the other folder is still linked. Please run yarn unlink in the other folder if you want to register this folder.
```
**解决方案**

对于Mac电脑，可以访问`~/.config/yarn/link`目录，使用`open .`方式打开对应的文件夹，然后删除对应的软链即可。

对于Window电脑，可以访问`C:\Users<user name>\AppData\Local\Yarn\Data\link`目录。（未验证）
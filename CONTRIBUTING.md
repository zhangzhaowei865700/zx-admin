中文 | [English](./CONTRIBUTING.en.md)

---

# 贡献指南

欢迎贡献代码！请按照以下步骤操作：

## 报告问题

- 使用 GitHub Issues 报告 Bug 或请求新功能
- 提交前请先搜索现有 Issues，避免重复
- 报告 Bug 时请包含：
  - 清晰的标题和描述
  - 复现步骤
  - 预期行为和实际行为
  - 环境信息（操作系统、浏览器、Node 版本）

## Pull Request 流程

1. **Fork** 本仓库 https://github.com/zhangzhaowei865700/zx-admin
2. **创建**功能分支: `git checkout -b feature/你的功能`
3. **编写**代码，遵循代码规范
4. **运行**代码检查: `npm run lint`
5. **提交**代码: `git commit -m '添加新功能'`
6. **推送**到远程: `git push origin feature/你的功能`
7. **提交** Pull Request

## 代码规范

- 使用 **2 个空格** 缩进
- 新代码使用 **TypeScript**
- 遵循项目现有的代码风格
- 复杂逻辑添加注释
- 提交信息要有意义

## 提交信息格式

```
<类型>(<范围>): <描述>

<正文>

<页脚>
```

类型说明：
- `feat`: 新功能
- `fix`: Bug 修复
- `refactor`: 代码重构
- `docs`: 文档更新
- `style`: 代码样式调整
- `test`: 测试相关

## 行为准则

- 尊重他人，保持包容
- 欢迎新手，帮助他人
- 优雅接受建设性批评

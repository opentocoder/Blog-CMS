# blog-cms - Claude 开发指令

> **由 CAS (Claude Autonomy System) 管理的项目**

## 核心规则

**每次对话开始时，必须：**

1. 阅读 `progress.md` 了解当前进度
2. 阅读 `task_plan.md` 了解下一个任务
3. **启动 CAS 循环**: `/cas-loop:cas-loop 按照 task_plan.md 继续开发`
4. 按照任务计划执行开发
5. 完成后更新 `progress.md`

## 项目信息

- **项目名称**: blog-cms
- **技术栈**: nextjs-ts
- **创建日期**: 2026-01-28

## 快速命令

| 命令 | 说明 |
|------|------|
| `/cas-loop:cas-loop 按照 task_plan.md 继续开发` | 启动自动循环 |
| `/cas-loop:status` | 查看当前状态 |
| `/cas-loop:stop` | 停止循环 |

---

*CAS v0.9.0*

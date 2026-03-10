# 通用业务组件 (common)

项目级通用业务组件，封装了常用的页面容器、表格、错误边界等能力。

## 组件列表

| 组件 | 路径 | 说明 |
| --- | --- | --- |
| `PageContainer` | `./PageContainer/index.tsx` | 页面容器 |
| `FormContainer` | `./FormContainer/index.tsx` | 表单容器（自动适配抽屉/弹窗、列数） |
| `ProTable` | `./ProTable/ProTable.tsx` | 增强表格（含导出、可拖拽列宽） |
| `EditableProTable` | `./ProTable/EditableProTable.tsx` | 增强可编辑表格（含导出、可拖拽列宽） |
| `HasPermission` | `./HasPermission/index.tsx` | 按钮级权限控制 |
| `ErrorBoundary` | `./ErrorBoundary/index.tsx` | 错误边界 |
| `PageSkeleton` | `./PageSkeleton/index.tsx` | 页面级骨架屏（dashboard / table / detail 三种类型） |
| `DictTag` | `./DictTag/index.tsx` | 字典值展示组件（自动查询字典并渲染为 Tag） |
| `VersionUpdateBar` | `./VersionUpdateBar/index.tsx` | 版本更新提示条（检测到新版本时显示） |

---

## PageContainer

基于 `@ant-design/pro-components` 的 `ProPageContainer` 封装，为所有页面提供统一的头部和布局。

### Props

透传 `ProPageContainer` 全部属性，常用：

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `title` | `string` | 页面标题 |
| `children` | `ReactNode` | 页面内容 |

### 用法

```tsx
import { PageContainer } from '@/components/common/PageContainer'

const DashboardPage = () => (
  <PageContainer title="仪表盘">
    <div>页面内容</div>
  </PageContainer>
)
```

---

## FormContainer

基于 `@ant-design/pro-components` 的 `ModalForm` / `DrawerForm` 封装，自动读取全局设置：

- **表单展示模式**：根据 `formDisplayMode` 自动切换弹窗 / 抽屉
- **表单列数**：根据 `formColumns` 自动开启 grid 布局
- **destroyOnClose**：默认开启

### Props

透传 `ModalFormProps` & `DrawerFormProps` 全部属性。组件内部自动处理 `drawerProps` / `modalProps` / `grid` / `colProps`，传入的同名属性会与默认值合并。

### 用法

```tsx
import { FormContainer } from '@/components/common/FormContainer'

<FormContainer
  title="新增用户"
  open={open}
  onOpenChange={setOpen}
  onFinish={async (values) => {
    await createUser(values)
    return true
  }}
>
  <ProFormText name="username" label="用户名" />
  <ProFormText name="email" label="邮箱" />
  {/* 字段级覆盖列宽 */}
  <ProFormTextArea name="remark" label="备注" colProps={{ span: 24 }} />
</FormContainer>
```

### 页面级覆盖

如需覆盖全局设置，直接传入 `grid` / `colProps` 即可：

```tsx
{/* 固定双列，忽略全局 formColumns */}
<FormContainer grid={true} colProps={{ span: 12 }} ...>

{/* 固定单列 */}
<FormContainer grid={false} ...>
```

---

## ProTable

基于 `@ant-design/pro-components` 的 `ProTable` 封装，增加了以下能力：

- **全局表格尺寸/边框**：自动读取 `useAppStore` 中的 `tableSize`、`tableBordered` 配置
- **可拖拽列宽**：开启全局 `tableResizable` 后，列头可拖拽调整宽度
- **数据导出**：开启 `exportable` 后，工具栏出现导出图标，点击弹出导出弹窗
- **行选择受控**：开启导出后自动接管 `rowSelection`，支持按选中行导出
- **默认分页**：内置 `showSizeChanger`、`showQuickJumper`，页码选项来自 `PAGINATION` 常量
- **默认横向滚动**：`scroll` 默认为 `{ x: 'max-content' }`，防止移动端挤压变形

### Props

继承 `ProTableProps<T, U>` 全部属性，额外新增：

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `exportable` | `boolean` | `false` | 是否显示导出按钮 |
| `exportFileName` | `string` | — | 导出文件名（不含扩展名） |
| `onExportAllData` | `() => Promise<T[]>` | — | 获取全量数据的回调（用于"全量数据"导出范围） |

### 用法

```tsx
import { ProTable } from '@/components/common/ProTable'

<ProTable<Tenant>
  columns={columns}
  request={async (params) => {
    const { list, total } = await getTenantList(params)
    return { data: list, total, success: true }
  }}
  rowKey="id"
  exportable
  exportFileName="商户列表"
/>
```

---

## EditableProTable

基于 `@ant-design/pro-components` 的 `EditableProTable` 封装，与 `ProTable` 具备相同的增强能力：

- **全局表格尺寸/边框**：自动读取 `useAppStore` 中的 `tableSize`、`tableBordered` 配置
- **可拖拽列宽**：开启全局 `tableResizable` 后，列头可拖拽调整宽度
- **数据导出**：开启 `exportable` 后，工具栏出现导出图标，点击弹出导出弹窗
- **行选择兼容**：拦截 `rowSelection.onChange` 捕获选中行数据供导出使用，不影响页面自身的选中状态管理
- **默认分页**：内置 `showSizeChanger`、`showQuickJumper`，页码选项来自 `PAGINATION` 常量
- **默认横向滚动**：`scroll` 默认为 `{ x: 'max-content' }`

### Props

继承 `EditableProTableProps<T, U>` 全部属性，额外新增：

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `exportable` | `boolean` | `false` | 是否显示导出按钮 |
| `exportFileName` | `string` | — | 导出文件名（不含扩展名） |
| `onExportAllData` | `() => Promise<T[]>` | — | 获取全量数据的回调（用于"全量数据"导出范围） |

### 用法

```tsx
import { EditableProTable } from '@/components/common/ProTable'

<EditableProTable<Product>
  rowKey="id"
  columns={columns}
  request={async (params) => {
    const { list, total } = await getProductList(params)
    return { data: list, total, success: true }
  }}
  editable={{
    type: 'multiple',
    editableKeys,
    onChange: setEditableRowKeys,
    onSave: async (_key, row) => {
      await updateProduct(row.id, row)
    },
  }}
  exportable
  exportFileName="商品列表"
  rowSelection={{
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
  }}
/>
```

> **注意**：`rowSelection.onChange` 会被内部拦截以捕获选中行数据，原始回调仍会正常执行，页面无需做任何适配。

### 目录结构

```
ProTable/
├── index.ts                ← barrel export（对外公共 API）
├── ProTable.tsx            ← ProTable 实现
├── EditableProTable.tsx    ← EditableProTable 实现
├── ExportModal.tsx         ← 内部组件，不对外暴露
└── ResizableHeaderCell.tsx ← 内部组件，不对外暴露
```

### 导出弹窗 (ExportModal)

`ExportModal` 是两个表格组件共用的内部子组件，不对外暴露。支持：

- 文件格式：xlsx、csv 等
- 数据范围：当前页 / 选中行 / 全量数据
- 字段选择：勾选需要导出的列
- 参数设置：表头、源数据等选项

---

## HasPermission

按钮级权限控制组件，基于 `usePermission` Hook 封装。权限码列表存储在 `useUserStore.permissions`，**空数组视为拥有全部权限**（兼容无权限管理的后端）。

### Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `code` | `string \| string[]` | — | 所需权限码，传数组时满足其一即可（OR 逻辑） |
| `children` | `ReactNode` | — | 有权限时渲染的内容 |
| `fallback` | `ReactNode` | `null` | 无权限时渲染的内容 |

### 用法

```tsx
import { HasPermission } from '@/components/common/HasPermission'

{/* 无权限时自动隐藏 */}
<HasPermission code="system:user:create">
  <Button type="primary">新增用户</Button>
</HasPermission>

{/* 多权限 OR 判断 */}
<HasPermission code={['system:user:edit', 'system:user:delete']}>
  <Space>...</Space>
</HasPermission>

{/* 无权限时渲染替代内容 */}
<HasPermission code="system:user:delete" fallback={<span>-</span>}>
  <a style={{ color: '#ff4d4f' }}>删除</a>
</HasPermission>
```

### Hook 形式

如需在逻辑中判断权限，使用 `usePermission`：

```tsx
import { usePermission } from '@/hooks'

const { hasPermission } = usePermission()

// 单个权限
if (hasPermission('system:user:delete')) { ... }

// 多权限 OR
if (hasPermission(['system:user:edit', 'system:user:delete'])) { ... }
```

---

## ErrorBoundary

React 错误边界组件（Class Component），捕获子组件渲染异常，显示兜底 UI。

### Props

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `children` | `ReactNode` | 子组件 |

### 行为

- 捕获子树中的渲染错误
- 在控制台输出错误信息
- 展示 Ant Design `Result` 错误页，提供「重试」按钮

### 用法

```tsx
import { ErrorBoundary } from '@/components/common/ErrorBoundary'

<ErrorBoundary>
  <App />
</ErrorBoundary>
```

---

## PageSkeleton

页面级骨架屏组件，在数据加载完成前代替真实内容渲染，避免布局跳变（CLS），提升用户感知加载体验。

内部包含三种预设布局，贴合项目中最常见的三类页面形态，开箱即用。

### Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `type` | `'dashboard' \| 'table' \| 'detail'` | — | 骨架屏类型 |
| `cards` | `number` | `4` | `dashboard` 类型的统计卡片数量 |
| `rows` | `number` | `8` | `table` 类型的骨架行数 |

### 类型说明

| type | 适用场景 | 效果 |
| --- | --- | --- |
| `dashboard` | 仪表盘页面 | 统计卡片 + 内容面板双列布局 |
| `table` | 列表页面 | 工具栏 + 多行表格行 + 分页区 |
| `detail` | 详情页 / 抽屉 | 头像 + 多行文字段落 |

### 用法

```tsx
import { PageSkeleton } from '@/components/common/PageSkeleton'

// 仪表盘骨架屏
if (loading) return <PageSkeleton type="dashboard" />

// 表格骨架屏（自定义行数）
if (loading) return <PageSkeleton type="table" rows={10} />

// 详情页骨架屏
if (loading) return <PageSkeleton type="detail" />
```

**推荐用法**：用条件渲染替换 `Spin` 包裹，避免内容区布局跳变：

```tsx
// ❌ 旧方式：Spin 包裹，内容区先渲染再遮罩，高度抖动
<Spin spinning={loading}>
  <DashboardContent />
</Spin>

// ✅ 新方式：loading 时完全替换为骨架屏，结构稳定
{loading ? (
  <PageSkeleton type="dashboard" />
) : (
  <DashboardContent />
)}
```

---

## DictTag

字典值展示组件，根据字典类型和值自动查询字典数据，渲染为带颜色的 Tag。

### Props

| 属性 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `dictType` | `string` | ✅ | 字典类型编码 |
| `value` | `string \| number` | ✅ | 字典项值 |

### 用法

```tsx
import { DictTag } from '@/components/common/DictTag'

// 在表格列中使用
{
  title: '订单状态',
  dataIndex: 'status',
  render: (status) => <DictTag dictType="order_status" value={status} />
}

// 在详情页中使用
<DictTag dictType="user_type" value={userInfo.type} />
```

### 工作原理

1. 通过 `useDictionary(dictType)` hook 获取字典数据
2. 调用 `getLabel(value)` 获取显示文本
3. 调用 `getColor(value)` 获取标签颜色
4. 渲染为 `<Tag color={color}>{label}</Tag>`

---

## VersionUpdateBar

版本更新提示条，检测到新版本时在页面顶部显示提示横幅。

### Props

无需传入任何 props，组件内部自动检测版本更新。

### 用法

```tsx
import { VersionUpdateBar } from '@/components/common/VersionUpdateBar'

// 在布局组件中使用
const AppLayout = () => (
  <Layout>
    <VersionUpdateBar />
    <Header />
    <Content />
  </Layout>
)
```

### 工作原理

1. 通过 `useVersionCheck()` hook 检测版本更新
2. 当 `hasNewVersion` 为 `true` 时显示 Alert 横幅
3. 用户点击"立即刷新"按钮调用 `refresh()` 刷新页面
4. 横幅可关闭，关闭后不再显示（直到下次检测到新版本）

### 特性

- **自动检测**：基于构建时间戳或版本号对比
- **国际化支持**：提示文本支持多语言
- **可关闭**：用户可手动关闭提示
- **非侵入式**：以横幅形式显示，不阻塞用户操作


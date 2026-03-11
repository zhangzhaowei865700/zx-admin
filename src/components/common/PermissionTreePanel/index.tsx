import { useMemo, useState } from 'react'
import { Button, Checkbox, Input, Tooltip, Tree, theme } from 'antd'
import type { DataNode } from 'antd/es/tree'
import { getAllLeafKeys, getAllTreeKeys } from '@/services/role.service'
import { useTranslation } from 'react-i18next'

export interface PermissionTreePanelProps {
  treeData: DataNode[]
  checkedKeys: number[]
  expandedKeys: number[]
  allExpanded: boolean
  searchValue: string
  searchPlaceholder: string
  onSearchChange: (value: string) => void
  onCheckedChange: (keys: number[]) => void
  onExpandedChange: (keys: number[]) => void
  onSelectAll: (checked: boolean) => void
  onClear: () => void
  onToggleExpand: () => void
  emptyText: string
  readonly?: boolean
  /** 联动模式下半选父级 key 变化回调 */
  onHalfCheckedChange?: (keys: number[]) => void
}

/** 收集所有叶子节点的 key */
function collectLeafKeys(nodes: DataNode[]): Set<React.Key> {
  const keys = new Set<React.Key>()
  const walk = (list: DataNode[]) => {
    for (const node of list) {
      if (!node.children || node.children.length === 0) {
        keys.add(node.key)
      } else {
        walk(node.children)
      }
    }
  }
  walk(nodes)
  return keys
}

/** 为只读模式构建带样式标记的树数据 */
function buildReadonlyTreeData(
  nodes: DataNode[],
  checkedSet: Set<number>,
  leafKeys: Set<React.Key>,
  tokenColor: string,
  tokenSuccessColor: string,
  tokenTextDisabled: string,
): DataNode[] {
  return nodes.map((node) => {
    const isLeaf = leafKeys.has(node.key)
    const isChecked = checkedSet.has(node.key as number)
    const hasChildren = node.children && node.children.length > 0

    let title: React.ReactNode
    if (isLeaf) {
      const dotStyle: React.CSSProperties = {
        display: 'inline-block',
        width: 6,
        height: 6,
        borderRadius: '50%',
        marginRight: 8,
        backgroundColor: isChecked ? tokenSuccessColor : tokenTextDisabled,
        verticalAlign: 'middle',
      }
      title = (
        <span style={{ color: isChecked ? tokenColor : tokenTextDisabled, fontSize: 14 }}>
          <span style={dotStyle} />
          {node.title as React.ReactNode}
        </span>
      )
    } else {
      title = (
        <span style={{ fontWeight: 500, fontSize: 14 }}>
          {node.title as React.ReactNode}
        </span>
      )
    }

    return {
      ...node,
      title,
      children: hasChildren
        ? buildReadonlyTreeData(node.children!, checkedSet, leafKeys, tokenColor, tokenSuccessColor, tokenTextDisabled)
        : undefined,
    }
  })
}

export const PermissionTreePanel: React.FC<PermissionTreePanelProps> = ({
  treeData,
  checkedKeys,
  expandedKeys,
  allExpanded,
  searchValue,
  searchPlaceholder,
  onSearchChange,
  onCheckedChange,
  onExpandedChange,
  onSelectAll,
  onClear,
  onToggleExpand,
  emptyText,
  readonly = false,
  onHalfCheckedChange,
}) => {
  const { token } = theme.useToken()
  const { t } = useTranslation(['common', 'system'])
  const [checkStrictly, setCheckStrictly] = useState(false)

  const allLeafCount = getAllLeafKeys(treeData).length

  const checkedSet = useMemo(() => new Set(checkedKeys), [checkedKeys])
  const leafKeys = useMemo(() => collectLeafKeys(treeData), [treeData])

  const readonlyTreeData = useMemo(() => {
    if (!readonly) return treeData
    return buildReadonlyTreeData(
      treeData,
      checkedSet,
      leafKeys,
      token.colorText,
      token.colorSuccess,
      token.colorTextDisabled,
    )
  }, [readonly, treeData, checkedSet, leafKeys, token.colorText, token.colorSuccess, token.colorTextDisabled])

  const handleSelectAll = (checked: boolean) => {
    if (checkStrictly) {
      // 非联动模式：全选所有节点（含父级）
      onCheckedChange(checked ? getAllTreeKeys(treeData as any) : [])
    } else {
      onSelectAll(checked)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden', gap: 8 }}>
      {/* 工具栏 */}
      <div
        style={{
          flexShrink: 0,
          padding: '8px 12px',
          background: token.colorFillAlter,
          border: `1px solid ${token.colorBorderSecondary}`,
          borderRadius: token.borderRadiusSM,
          display: 'flex',
          gap: 6,
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <Input
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          allowClear
          size="small"
          style={{ width: 170, flex: '0 0 auto' }}
        />
        <div style={{ width: 1, height: 16, background: token.colorBorderSecondary, flexShrink: 0 }} />
        {!readonly && (
          <>
            <Checkbox
              checked={checkedKeys.length > 0}
              indeterminate={checkedKeys.length > 0 && checkedKeys.length < allLeafCount}
              onChange={(e) => handleSelectAll(e.target.checked)}
            >
              <span style={{ fontSize: 13 }}>{t('common:selectAll')}</span>
            </Checkbox>
            <Tooltip title={t('system:role.parentChildLinked')}>
              <Checkbox
                checked={!checkStrictly}
                onChange={(e) => setCheckStrictly(!e.target.checked)}
              >
                <span style={{ fontSize: 13 }}>{t('system:role.linked')}</span>
              </Checkbox>
            </Tooltip>
            <Button type="link" size="small" style={{ padding: '0 4px' }} onClick={onClear}>
              {t('common:clear')}
            </Button>
          </>
        )}
        <Button type="link" size="small" style={{ padding: '0 4px' }} onClick={onToggleExpand}>
          {allExpanded ? t('common:collapse') : t('common:expand')}
        </Button>
      </div>

      {/* 树容器 */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          minHeight: 0,
          border: `1px solid ${token.colorBorderSecondary}`,
          borderRadius: token.borderRadiusSM,
          padding: '6px 4px',
          background: token.colorBgContainer,
          display: 'flex',
          alignItems: treeData.length === 0 ? 'center' : undefined,
          justifyContent: treeData.length === 0 ? 'center' : undefined,
        }}
      >
        {treeData.length === 0 ? (
          <span style={{ color: token.colorTextDisabled }}>{emptyText}</span>
        ) : readonly ? (
          <Tree
            selectable={false}
            expandedKeys={expandedKeys}
            onExpand={(keys) => onExpandedChange(keys as number[])}
            treeData={readonlyTreeData}
          />
        ) : (
          <Tree
            checkable
            checkStrictly={checkStrictly}
            expandedKeys={expandedKeys}
            onExpand={(keys) => onExpandedChange(keys as number[])}
            checkedKeys={checkedKeys}
            onCheck={(keys, info) => {
              if (Array.isArray(keys)) {
                // 联动模式：keys 是 Key[]，halfCheckedKeys 在 info 中
                onCheckedChange(keys as number[])
                onHalfCheckedChange?.(info.halfCheckedKeys as number[])
              } else {
                // 非联动模式：keys 是 { checked, halfChecked }
                onCheckedChange(keys.checked as number[])
                onHalfCheckedChange?.([])
              }
            }}
            treeData={treeData}
          />
        )}
      </div>
    </div>
  )
}

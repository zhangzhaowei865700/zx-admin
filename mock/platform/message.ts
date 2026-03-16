import { withAuth } from './auth'

const mockMessages = [
  // 公告
  { id: 1, title: '系统升级通知', content: '尊敬的用户，系统将于2026年3月15日凌晨2:00-6:00进行版本升级维护，届时系统将暂停服务，请提前做好相关安排。本次升级将优化系统性能，修复已知问题，并新增多项功能。', type: 'announcement', priority: 'important', senderId: 1, senderName: '系统管理员', isRead: false, createdAt: '2026-03-08 10:00:00' },
  { id: 2, title: '关于调整平台服务费率的通知', content: '根据公司经营策略调整，平台服务费率将于2026年4月1日起进行调整。新费率方案已通过邮件发送至各商户管理员，请及时查阅。如有疑问，请联系客服。', type: 'announcement', priority: 'important', senderId: 1, senderName: '系统管理员', isRead: false, createdAt: '2026-03-07 14:30:00' },
  { id: 3, title: '春季促销活动方案发布', content: '2026年春季促销活动方案已正式发布，活动时间为3月20日至4月20日。各商户可在活动管理页面中查看详细规则并报名参加。', type: 'announcement', priority: 'normal', senderId: 1, senderName: '运营部', isRead: true, createdAt: '2026-03-06 09:00:00' },
  { id: 4, title: '数据安全规范更新', content: '为保障用户数据安全，平台已更新数据安全管理规范。请各商户管理员认真阅读新规范并确保合规操作。新规范将于2026年4月1日起正式生效。', type: 'announcement', priority: 'normal', senderId: 1, senderName: '安全部', isRead: true, createdAt: '2026-03-05 16:00:00' },
  { id: 5, title: '新版API接口文档发布', content: '新版API接口文档已发布，涵盖订单、商品、支付等模块的最新接口说明。请开发人员及时更新对接方案。文档地址已发送至技术对接群。', type: 'announcement', priority: 'normal', senderId: 1, senderName: '技术部', isRead: true, createdAt: '2026-03-04 11:00:00' },
  { id: 6, title: '端午节放假通知', content: '根据国务院办公厅通知，2026年端午节放假安排如下：5月31日至6月2日放假调休，共3天。请各部门做好节前工作安排。', type: 'announcement', priority: 'normal', senderId: 1, senderName: '行政部', isRead: true, createdAt: '2026-03-03 10:00:00' },

  // 通知
  { id: 7, title: '账户安全提醒', content: '您的账户于2026年3月8日 08:32在新设备（Windows 11, Chrome 120）上登录。如非本人操作，请立即修改密码并联系管理员。', type: 'notification', priority: 'urgent', senderId: 0, senderName: '系统', isRead: false, createdAt: '2026-03-08 08:32:00' },
  { id: 8, title: '密码即将过期', content: '您的登录密码将于7天后过期，为避免影响正常使用，请及时修改密码。修改路径：个人中心 > 安全设置 > 修改密码。', type: 'notification', priority: 'important', senderId: 0, senderName: '系统', isRead: false, createdAt: '2026-03-07 15:30:00' },
  { id: 9, title: '审批通过通知', content: '您提交的商户入驻申请（申请编号：SH20260305001）已审批通过。商户信息已生效，可正常使用平台功能。', type: 'notification', priority: 'normal', senderId: 0, senderName: '系统', isRead: false, createdAt: '2026-03-07 10:15:00' },
  { id: 10, title: '操作日志异常提醒', content: '检测到账户在过去24小时内有异常操作记录（批量删除操作15次），请确认是否为本人操作。如非本人操作，请立即联系管理员。', type: 'notification', priority: 'urgent', senderId: 0, senderName: '系统', isRead: true, createdAt: '2026-03-06 18:00:00' },
  { id: 11, title: '存储空间不足提醒', content: '当前商户存储空间使用率已达85%，建议及时清理过期数据或申请扩容，避免影响正常业务。', type: 'notification', priority: 'important', senderId: 0, senderName: '系统', isRead: true, createdAt: '2026-03-05 09:00:00' },
  { id: 12, title: '角色权限变更通知', content: '您的账户角色已由"普通用户"变更为"运营管理员"，新增权限已即时生效。如有疑问，请联系管理员。', type: 'notification', priority: 'normal', senderId: 0, senderName: '系统', isRead: true, createdAt: '2026-03-04 14:20:00' },
  { id: 13, title: '系统维护完成通知', content: '计划内系统维护已完成，所有服务已恢复正常。如遇到任何问题，请联系技术支持。', type: 'notification', priority: 'normal', senderId: 0, senderName: '系统', isRead: true, createdAt: '2026-03-03 06:00:00' },

  // 私信
  { id: 14, title: '项目进度汇报', content: '王总好，关于XX项目的进度汇报：目前前端页面开发已完成80%，后端接口已全部就绪，预计本周五可以提交测试。请问是否需要安排中期评审？', type: 'message', priority: 'normal', senderId: 2, senderName: '张三', isRead: false, createdAt: '2026-03-08 09:00:00' },
  { id: 15, title: '会议纪要分享', content: '以下是今天上午产品需求评审会的会议纪要，请查阅。重点议题：1.用户反馈优化方案 2.Q2功能排期 3.技术方案选型。详细内容见附件。', type: 'message', priority: 'normal', senderId: 3, senderName: '李四', isRead: false, createdAt: '2026-03-07 16:00:00' },
  { id: 16, title: '权限申请', content: '您好，我需要申请"数据导出"权限，用于导出本月商户经营数据报表。请审批，谢谢！', type: 'message', priority: 'normal', senderId: 5, senderName: '赵六', isRead: false, createdAt: '2026-03-07 11:30:00' },
  { id: 17, title: '商户投诉处理反馈', content: '关于商户"星海民宿"的投诉（工单号：GD20260306001），经核实已安排退款处理，商户表示满意。请知悉。', type: 'message', priority: 'important', senderId: 2, senderName: '张三', isRead: true, createdAt: '2026-03-06 15:45:00' },
  { id: 18, title: '技术方案讨论', content: '关于消息推送模块的技术方案，建议采用 WebSocket 方案，支持实时推送。备选方案为轮询模式，实现成本较低。请问您倾向哪种方案？', type: 'message', priority: 'normal', senderId: 3, senderName: '李四', isRead: true, createdAt: '2026-03-05 14:00:00' },
  { id: 19, title: '新员工入职提醒', content: '明天将有3名新员工入职研发部，已安排座位和设备。请协助开通系统账号和相关权限。名单：刘一、陈二、周三。', type: 'message', priority: 'normal', senderId: 4, senderName: '王五', isRead: true, createdAt: '2026-03-04 17:00:00' },
  { id: 20, title: '数据报表已生成', content: '2026年2月的平台经营数据报表已生成完毕，可在数据中心下载查看。本月GMV环比增长12.5%，活跃商户数增长8.3%。', type: 'message', priority: 'normal', senderId: 5, senderName: '赵六', isRead: true, createdAt: '2026-03-03 10:30:00' },
]

export default [
  // 消息列表（分页 + 筛选）
  {
    url: '/api/admin/message/list',
    method: 'POST',
    response: withAuth(({ body }: any) => {
      const { pageNum = 1, pageSize = 10, type, isRead, keyword } = body || {}
      let filtered = [...mockMessages]
      if (type) filtered = filtered.filter((m) => m.type === type)
      if (isRead !== undefined && isRead !== '' && isRead !== null) filtered = filtered.filter((m) => m.isRead === !!isRead)
      if (keyword) filtered = filtered.filter((m) => m.title.includes(keyword) || m.content.includes(keyword))
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      const start = (pageNum - 1) * pageSize
      return { code: 200, data: { list: filtered.slice(start, start + pageSize), total: filtered.length }, msg: 'success' }
    }),
  },
  // 标记已读
  {
    url: '/api/admin/message/read',
    method: 'POST',
    response: withAuth(({ body }: any) => {
      const { ids } = body || {}
      if (ids) {
        ids.forEach((id: number) => {
          const m = mockMessages.find((x) => x.id === id)
          if (m) m.isRead = true
        })
      }
      return { code: 200, data: null, msg: '标记成功' }
    }),
  },
  // 全部已读
  {
    url: '/api/admin/message/read-all',
    method: 'POST',
    response: withAuth(() => {
      mockMessages.forEach((m) => (m.isRead = true))
      return { code: 200, data: null, msg: '全部已读' }
    }),
  },
  // 删除消息
  {
    url: '/api/admin/message/delete',
    method: 'POST',
    response: withAuth(({ body }: any) => {
      const { ids } = body || {}
      if (ids) {
        ids.forEach((id: number) => {
          const idx = mockMessages.findIndex((m) => m.id === id)
          if (idx > -1) mockMessages.splice(idx, 1)
        })
      }
      return { code: 200, data: null, msg: '删除成功' }
    }),
  },
  // 未读数统计
  {
    url: '/api/admin/message/unread-count',
    method: 'GET',
    response: withAuth(() => {
      const unread = mockMessages.filter((m) => !m.isRead)
      return {
        code: 200,
        data: {
          total: unread.length,
          announcement: unread.filter((m) => m.type === 'announcement').length,
          notification: unread.filter((m) => m.type === 'notification').length,
          message: unread.filter((m) => m.type === 'message').length,
        },
        msg: 'success',
      }
    }),
  },
  // 消息详情（放在最后，避免 :id 匹配到 unread-count 等路径）
  {
    url: '/api/admin/message/:id',
    method: 'GET',
    response: withAuth(({ query }: any) => {
      const msg = mockMessages.find((m) => m.id === Number(query?.id))
      if (msg) msg.isRead = true
      return { code: 200, data: msg || null, msg: 'success' }
    }),
  },
]

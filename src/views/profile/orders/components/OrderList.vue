<template>
  <div class="order-list" v-loading="loading">
    <div v-for="order in orders" :key="order.orderId" class="order-item">
      <div class="order-header">
        <span class="order-id">订单号：{{ order.orderId }}</span>
        <span class="order-status" :class="getStatusClass(order.status)">
          {{ getStatusText(order.status) }}
        </span>
      </div>

      <div class="order-content">
        <div
          v-for="item in order.items"
          :key="item.productId"
          class="product-item"
        >
          <el-image
            :src="getImageUrl(item.imageUrl)"
            fit="cover"
            class="product-image"
          >
            <template #error>
              <div class="image-placeholder">
                <el-icon><Picture /></el-icon>
              </div>
            </template>
          </el-image>
          <div class="product-info">
            <h3>{{ item.productName }}</h3>
            <p class="quantity">数量：{{ item.quantity }}</p>
            <p class="price">¥{{ item.price.toFixed(2) }}</p>
          </div>
        </div>
      </div>

      <div class="order-footer">
        <div class="total-amount">
          总计：<span class="price">¥{{ order.totalAmount.toFixed(2) }}</span>
        </div>
        <div class="order-actions">
          <el-button
            v-if="!order.isPaid"
            type="primary"
            class="pay-btn"
            @click="handlePay(order)"
          >
            立即支付
          </el-button>
          <el-button
            v-if="order.status === 'PENDING_PAY'"
            type="danger"
            @click="handleCancel(order)"
          >
            取消订单
          </el-button>
        </div>
      </div>
    </div>

    <div v-if="!orders.length" class="empty-state">
      <el-empty description="暂无订单" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { Picture } from "@element-plus/icons-vue";
import orderApi from "@/api/order";
import { useOrderStore } from "@/stores/order";

const props = defineProps({
  orders: {
    type: Array,
    required: true,
  },
});

const router = useRouter();
const orderStore = useOrderStore();
const loading = ref(false);

// 订单状态映射
const ORDER_STATUS = {
  CREATED: '已创建',
  PENDING_PAY: '待支付',
  PAYING: '支付中',
  PAID: '已支付',
  CANCELLED: '已取消',
  EXPIRED: '已过期'
}

// 获取订单状态文本
const getStatusText = (status) => {
  return ORDER_STATUS[status] || status
}

// 获取订单状态样式类
const getStatusClass = (status) => {
  return {
    'status-created': status === 'CREATED',
    'status-pending': status === 'PENDING_PAY',
    'status-paying': status === 'PAYING',
    'status-paid': status === 'PAID',
    'status-cancelled': status === 'CANCELLED',
    'status-expired': status === 'EXPIRED'
  }
}

// 监听订单状态变化
watch(
  () => props.orders,
  (newOrders) => {
    console.log("订单列表更新:", newOrders);
  },
  { deep: true }
);

const handlePay = (order) => {
  router.push(`/payment/${order.orderId}/${order.totalAmount}`);
};

const handleCancel = async (order) => {
  try {
    await ElMessageBox.confirm("确定要取消该订单吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    const response = await orderApi.cancelOrder(order.orderId);
    if (response.state === 200) {
      ElMessage.success("订单已取消");
      // 触发父组件刷新订单列表
      emit("refresh");
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("取消订单失败:", error);
      ElMessage.error("取消订单失败");
    }
  }
};

// 添加处理图片 URL 的方法
const getImageUrl = (imageUrl) => {
  if (!imageUrl) return "";
  if (imageUrl.startsWith("http")) {
    return imageUrl;
  }
  return `http://localhost:8088/${imageUrl}`;
};
</script>

<style scoped>
.order-item {
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(250, 159, 252, 0.3);
  transform: none !important;
  transition: none !important;
  box-shadow: none !important;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(250, 159, 252, 0.3);
  margin-bottom: 10px;
}

.order-id {
  color: var(--starlight);
}

.order-status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
}

.status-created {
  background: rgba(64, 158, 255, 0.1);
  color: #409EFF;
}

.status-pending {
  background: rgba(230, 162, 60, 0.1);
  color: #E6A23C;
}

.status-paying {
  background: rgba(144, 147, 153, 0.1);
  color: #909399;
}

.status-paid {
  background: rgba(103, 194, 58, 0.1);
  color: #67C23A;
}

.status-cancelled {
  background: rgba(245, 108, 108, 0.1);
  color: #F56C6C;
}

.status-expired {
  background: rgba(144, 147, 153, 0.1);
  color: #909399;
}

.product-item {
  display: flex;
  gap: 15px;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.product-image {
  width: 80px;
  height: 80px;
  border-radius: 6px;
  overflow: hidden;
}

.product-info {
  flex: 1;
}

.product-info h3 {
  margin: 0 0 10px;
  color: var(--starlight);
}

.quantity {
  color: var(--text-secondary);
}

.price {
  color: var(--aurora-pink);
  font-weight: bold;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  padding-top: 10px;
}

.total-amount {
  font-size: 18px;
  color: var(--starlight);
}

.order-actions {
  display: flex;
  gap: 8px;
}

.pay-btn {
  background: linear-gradient(45deg, var(--aurora-pink), var(--cosmic-blue));
  border: none;
  padding: 8px 20px;
  color: var(--starlight);
  transition: opacity 0.3s;
}

.pay-btn:hover {
  opacity: 0.9;
}

.empty-state {
  padding: 40px;
  text-align: center;
}
</style>

<template>
  <div class="payment-container dream-card">
    <div class="page-header">
      <router-link to="/home" class="back-home">
        <el-button type="primary" class="home-btn">
          <el-icon><HomeFilled /></el-icon>
          返回主页
        </el-button>
      </router-link>
      <h1 class="cyber-text">订单支付</h1>
    </div>

    <div class="payment-content" v-loading="loading">
      <div class="order-info">
        <h2>订单信息</h2>
        <p>订单号：{{ orderId }}</p>
        <p>支付金额：¥{{ totalAmount }}</p>
        <h3>商品详情:</h3>
        <ul>
          <li v-for="item in productDetails" :key="item.cartItemId">
            {{ item.productName }} - 数量: {{ item.quantity }} - 价格: ¥{{
              item.price
            }}
          </li>
        </ul>
      </div>

      <div class="payment-actions">
        <el-button
          type="primary"
          @click="handlePayment"
          :loading="paymentLoading"
          class="pay-btn"
        >
          确认支付
        </el-button>
        <el-button @click="cancelPayment">取消支付</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import orderApi from "@/api/order";
import { generatePaymentId } from "@/utils/payment";
import { useCheckoutStore } from "@/stores/checkout";
import { useOrderStore } from "@/stores/order";

const route = useRoute();
const router = useRouter();
const orderStore = useOrderStore();
const loading = ref(false);
const paymentLoading = ref(false);

// 从路由参数和 store 中获取订单信息
const orderId = route.params.orderId;
const totalAmount = route.params.totalAmount;
const orderInfo = ref(orderStore.currentOrder);
const productDetails = ref([]); // 添加商品详情列表

// 添加调试信息
console.log("支付页面信息:", {
  routeParams: {
    orderId: orderId,
    totalAmount: totalAmount,
  },
  orderInfo: orderInfo.value,
});

// 验证订单信息
onMounted(() => {
  if (!orderId || !totalAmount || !orderInfo.value) {
    ElMessage.error("订单信息不完整");
    router.push("/cart");
    return;
  }

  // 显示订单详情
  productDetails.value = orderInfo.value.items || [];
});

const handlePayment = async () => {
  try {
    const paymentId = generatePaymentId()
    const response = await orderStore.payCurrentOrder(paymentId)
    
    if (response.state === 200) {
      ElMessage.success('支付成功！')
      // 支付成功后跳转到订单列表页面
      router.push('/profile/orders')
    }
  } catch (error) {
    ElMessage.error(error.message || '支付失败')
  }
}

const cancelPayment = () => {
  ElMessage.warning("取消支付");
  router.push("/profile/orders");
};
</script>

<style scoped>
.payment-container {
  max-width: 800px;
  margin: 80px auto 20px;
  padding: 20px;
  background: rgba(6, 5, 36, 0.95);
  border-radius: 15px;
  box-shadow: 0 0 20px rgba(250, 159, 252, 0.2);
}

.page-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(250, 159, 252, 0.3);
}

.back-home {
  margin-right: 20px;
}

.home-btn {
  display: flex;
  align-items: center;
  gap: 5px;
}

.payment-content {
  padding: 20px;
}

.order-info {
  margin-bottom: 30px;
  color: var(--starlight);
}

.order-info h2 {
  color: var(--cosmic-blue);
  margin-bottom: 15px;
}

.payment-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 30px;
}

.pay-btn {
  min-width: 120px;
  background: linear-gradient(45deg, var(--aurora-pink), var(--cosmic-blue));
  border: none;
}

.pay-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(250, 159, 252, 0.3);
}
</style>

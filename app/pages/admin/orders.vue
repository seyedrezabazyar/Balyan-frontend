<template>
     <div>
       <h1 class="text-2xl font-bold mb-4">مدیریت سفارشات</h1>
       <table class="w-full border-collapse">
         <thead>
           <tr>
             <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">شماره سفارش</th>
             <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">کاربر</th>
             <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">وضعیت</th>
             <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">مبلغ کل</th>
             <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">روش پرداخت</th>
             <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">تاریخ ثبت</th>
             <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">جزئیات خرید</th>
             <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">عملیات</th>
           </tr>
         </thead>
         <tbody>
           <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50">
             <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
               <NuxtLink
                 v-if="order?.actions?.download_token"
                 :to="`/book/download/${order.actions.download_token}`"
                 class="text-blue-600 hover:underline font-semibold"
                 target="_blank"
               >
                 {{ order.order_number }}
               </NuxtLink>
               <span v-else class="text-gray-600">{{ order.order_number }} [غیرفعال]</span>
             </td>
             <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
               {{ order.user?.name || 'نامشخص' }}<br />{{ order.user?.email || 'ایمیل نامشخص' }}
             </td>
             <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">{{ order.status || 'نامشخص' }}</td>
             <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">{{ order.total_amount }} {{ order.currency }}</td>
             <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">{{ order.payment_method || 'نامشخص' }}</td>
             <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">{{ formatDate(order.created_at) }}</td>
             <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
               <NuxtLink
                 v-for="item in order.items || []"
                 :key="item.id"
                 :to="item?.book?.page_url || '#'"
                 class="text-blue-600 hover:underline font-semibold block"
                 target="_blank"
               >
                 {{ item.title || 'بدون عنوان' }}
               </NuxtLink>
               <span v-if="!order.items || order.items.length === 0" class="text-gray-600">بدون جزئیات</span>
             </td>
             <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
               <button
                 v-if="order?.actions?.renew_url"
                 @click="performAction(order, 'renew')"
                 class="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
               >
                 تمدید
               </button>
               <button
                 v-else-if="order?.actions?.expire_url"
                 @click="performAction(order, 'expire')"
                 class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
               >
                 منقضی کردن
               </button>
             </td>
           </tr>
         </tbody>
       </table>
     </div>
   </template>

   <script setup>
   import { ref } from 'vue';
   import { useApiAuth } from '~/composables/useApiAuth';

   const orders = ref([]);
   const api = useApiAuth();

   const fetchOrders = async () => {
     try {
       const response = await api.get('/admin/orders');
       orders.value = response.data;
     } catch (error) {
       console.error('Failed to fetch orders:', error);
     }
   };

   const formatDate = (date) => {
     return new Date(date).toLocaleDateString('fa-IR');
   };

   const performAction = async (order, action) => {
     try {
       const url = action === 'renew' ? order.actions.renew_url : order.actions.expire_url;
       await api.post(url);
       await fetchOrders();
     } catch (error) {
       console.error(`Failed to ${action} order:`, error);
     }
   };

   fetchOrders();
   </script>

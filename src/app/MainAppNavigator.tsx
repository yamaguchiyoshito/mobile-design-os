import {
  PaymentCheckoutScreen,
} from '../features/payment/components/PaymentCheckoutScreen';
import {
  PaymentResultScreen,
  type PaymentResultStatus,
} from '../features/payment/components/PaymentResultScreen';
import { AppPreferencesScreen } from '../features/settings/components/AppPreferencesScreen';
import { NotificationsInboxScreen } from '../features/notifications/components/NotificationsInboxScreen';
import { OrderDetailScreen } from '../features/orders/components/OrderDetailScreen';
import {
  OrdersOverviewScreen,
  type OrdersOverviewFilter,
  type OrdersOverviewSort,
  type OrdersOverviewTab,
} from '../features/orders/components/OrdersOverviewScreen';
import { ProfileHomeScreen } from '../features/profile/components/ProfileHomeScreen';
import { SearchHomeScreen } from '../features/search/components/SearchHomeScreen';
import { TabBar } from '../components/ui';
import { useAppLocation, useAppRouter } from '../lib/appRouter';

export type MainAppNavigatorProps = {
  pathname?: string;
};

const TAB_ITEMS = [
  { key: 'search', label: '検索', icon: 'search' as const },
  { key: 'orders', label: '注文', icon: 'shopping-cart' as const },
  { key: 'notifications', label: '通知', icon: 'bell' as const, badge: 2 },
  { key: 'profile', label: '設定', icon: 'user' as const },
] as const;

const TAB_PATHS: Record<(typeof TAB_ITEMS)[number]['key'], string> = {
  search: '/(main)/search',
  orders: '/(main)/orders',
  notifications: '/(main)/notifications',
  profile: '/(main)/profile',
};
const ORDER_TAB_VALUES: OrdersOverviewTab[] = ['all', 'action-required', 'refund', 'payment'];
const ORDER_SORT_VALUES: OrdersOverviewSort[] = [
  'updated-desc',
  'updated-asc',
  'amount-desc',
  'amount-asc',
];

function readOptionalParam(params: URLSearchParams, key: string) {
  const value = params.get(key);
  return value && value.trim().length ? value : undefined;
}

function isOrdersTab(value?: string): value is OrdersOverviewTab {
  return value ? ORDER_TAB_VALUES.includes(value as OrdersOverviewTab) : false;
}

function isOrdersSort(value?: string): value is OrdersOverviewSort {
  return value ? ORDER_SORT_VALUES.includes(value as OrdersOverviewSort) : false;
}

function readOrdersTab(params: URLSearchParams): OrdersOverviewTab {
  const directTab = readOptionalParam(params, 'tab');

  if (isOrdersTab(directTab)) {
    return directTab;
  }

  return readOptionalParam(params, 'filter') === 'action-required' ? 'action-required' : 'all';
}

function readOrdersSort(params: URLSearchParams): OrdersOverviewSort {
  const value = readOptionalParam(params, 'sort');
  return isOrdersSort(value) ? value : 'updated-desc';
}

function buildCheckoutHref({
  orderId,
  amountLabel,
  paymentUrl,
}: {
  orderId?: string;
  amountLabel?: string;
  paymentUrl?: string;
}) {
  const params = new URLSearchParams();

  if (orderId) {
    params.set('orderId', orderId);
  }

  if (amountLabel) {
    params.set('amountLabel', amountLabel);
  }

  if (paymentUrl) {
    params.set('paymentUrl', paymentUrl);
  }

  return `/(main)/payment/checkout${params.size ? `?${params.toString()}` : ''}`;
}

function getPaymentResultStatus(pathname: string): PaymentResultStatus | null {
  const matched = pathname.match(/^\/\(main\)\/payment\/result\/(success|error|cancelled)$/);

  if (!matched?.[1]) {
    return null;
  }

  return matched[1] as PaymentResultStatus;
}

function getOrderDetailId(pathname: string) {
  const matched = pathname.match(/^\/\(main\)\/orders\/([^/?]+)$/);

  if (!matched?.[1]) {
    return null;
  }

  return decodeURIComponent(matched[1]);
}

function buildOrderDetailHref({
  orderId,
  transactionId,
  amountLabel,
}: {
  orderId: string;
  transactionId?: string;
  amountLabel?: string;
}) {
  const params = new URLSearchParams();

  if (transactionId) {
    params.set('transactionId', transactionId);
  }

  if (amountLabel) {
    params.set('amountLabel', amountLabel);
  }

  return `/(main)/orders/${encodeURIComponent(orderId)}${params.size ? `?${params.toString()}` : ''}`;
}

function buildOrdersHref({
  tab = 'all',
  q,
  sort = 'updated-desc',
}: {
  tab?: OrdersOverviewTab;
  q?: string;
  sort?: OrdersOverviewSort;
}) {
  const params = new URLSearchParams();
  const normalizedQuery = q?.trim();

  if (tab !== 'all') {
    params.set('tab', tab);
  }

  if (normalizedQuery) {
    params.set('q', normalizedQuery);
  }

  if (sort !== 'updated-desc') {
    params.set('sort', sort);
  }

  return `/(main)/orders${params.size ? `?${params.toString()}` : ''}`;
}

function getActiveTabKey(pathname: string) {
  if (pathname.startsWith('/(main)/orders')) {
    return 'orders';
  }

  if (pathname.startsWith('/(main)/notifications')) {
    return 'notifications';
  }

  if (pathname.startsWith('/(main)/profile')) {
    return 'profile';
  }

  return 'search';
}

function RouteSurface({
  pathname,
  search,
  onOpenSettings,
  onBackToProfile,
  onOpenOrder,
  onBackToOrders,
  onResumePayment,
  onChangeOrdersFilter,
  onChangeOrdersTab,
  onChangeOrdersQuery,
  onChangeOrdersSort,
}: {
  pathname: string;
  search: string;
  onOpenSettings: () => void;
  onBackToProfile: () => void;
  onOpenOrder: (orderId: string) => void;
  onBackToOrders: () => void;
  onResumePayment: (orderId: string, amountLabel: string) => void;
  onChangeOrdersFilter: (filter: OrdersOverviewFilter) => void;
  onChangeOrdersTab: (tab: OrdersOverviewTab) => void;
  onChangeOrdersQuery: (query: string) => void;
  onChangeOrdersSort: (sort: OrdersOverviewSort) => void;
}) {
  const params = new URLSearchParams(search);
  const orderId = readOptionalParam(params, 'orderId');
  const amountLabel = readOptionalParam(params, 'amountLabel');
  const paymentUrl = readOptionalParam(params, 'paymentUrl');
  const transactionId = readOptionalParam(params, 'transactionId');
  const orderListFilter = readOptionalParam(params, 'filter') === 'action-required' ? 'action-required' : 'all';
  const orderListTab = readOrdersTab(params);
  const orderListQuery = readOptionalParam(params, 'q') ?? '';
  const orderListSort = readOrdersSort(params);
  const resultStatus = getPaymentResultStatus(pathname);
  const orderDetailId = getOrderDetailId(pathname);

  if (pathname === '/(main)/payment/checkout') {
    return (
      <PaymentCheckoutScreen
        orderId={orderId}
        amountLabel={amountLabel}
        paymentUrl={paymentUrl}
      />
    );
  }

  if (resultStatus) {
    const sharedCheckoutHref = buildCheckoutHref({ orderId, amountLabel, paymentUrl });
    const orderDetailHref = orderId
      ? buildOrderDetailHref({ orderId, transactionId, amountLabel })
      : '/(main)/orders';

    return (
      <PaymentResultScreen
        status={resultStatus}
        transactionId={transactionId}
        orderId={orderId}
        amountLabel={amountLabel}
        errorMessage={readOptionalParam(params, 'errorMessage')}
        primaryHref={
          resultStatus === 'success' ? '/(main)/search' : sharedCheckoutHref
        }
        secondaryHref={resultStatus === 'success' ? orderDetailHref : '/(main)/search'}
      />
    );
  }

  if (orderDetailId) {
    return (
      <OrderDetailScreen
        orderId={orderDetailId}
        transactionId={transactionId}
        amountLabel={amountLabel}
        onBackToOrders={onBackToOrders}
        onResumePayment={onResumePayment}
      />
    );
  }

  if (pathname === '/(main)/profile/settings') {
    return <AppPreferencesScreen onBack={onBackToProfile} />;
  }

  if (pathname === '/(main)/orders') {
    return (
      <OrdersOverviewScreen
        onOpenOrder={onOpenOrder}
        filter={orderListFilter}
        onChangeFilter={onChangeOrdersFilter}
        tab={orderListTab}
        onChangeTab={onChangeOrdersTab}
        query={orderListQuery}
        onChangeQuery={onChangeOrdersQuery}
        sort={orderListSort}
        onChangeSort={onChangeOrdersSort}
      />
    );
  }

  if (pathname === '/(main)/notifications') {
    return <NotificationsInboxScreen />;
  }

  if (pathname === '/(main)/profile') {
    return <ProfileHomeScreen onOpenSettings={onOpenSettings} />;
  }

  return <SearchHomeScreen />;
}

export function MainAppNavigator({ pathname }: MainAppNavigatorProps) {
  const { pathname: resolvedPathname, search } = useAppLocation(pathname);
  const router = useAppRouter();
  const activeKey = getActiveTabKey(resolvedPathname);
  const params = new URLSearchParams(search);
  const currentOrdersTab = readOrdersTab(params);
  const currentOrdersQuery = readOptionalParam(params, 'q') ?? '';
  const currentOrdersSort = readOrdersSort(params);

  return (
    <div style={{ display: 'grid', minHeight: '100vh', gridTemplateRows: '1fr auto' }}>
      <RouteSurface
        pathname={resolvedPathname}
        search={search}
        onOpenSettings={() => {
          router.push('/(main)/profile/settings');
        }}
        onBackToProfile={() => {
          router.push('/(main)/profile');
        }}
        onOpenOrder={(orderId) => {
          router.push(buildOrderDetailHref({ orderId }));
        }}
        onBackToOrders={() => {
          router.push('/(main)/orders');
        }}
        onResumePayment={(orderId, amountLabel) => {
          router.push(buildCheckoutHref({ orderId, amountLabel }));
        }}
        onChangeOrdersFilter={(filter) => {
          router.push(buildOrdersHref({ tab: filter }));
        }}
        onChangeOrdersTab={(tab) => {
          router.push(buildOrdersHref({ tab, q: currentOrdersQuery, sort: currentOrdersSort }));
        }}
        onChangeOrdersQuery={(query) => {
          router.push(buildOrdersHref({ tab: currentOrdersTab, q: query, sort: currentOrdersSort }));
        }}
        onChangeOrdersSort={(sort) => {
          router.push(buildOrdersHref({ tab: currentOrdersTab, q: currentOrdersQuery, sort }));
        }}
      />
      <div style={{ padding: 16 }}>
        <TabBar
          items={TAB_ITEMS.map((item) => ({ ...item }))}
          activeKey={activeKey}
          onChange={(key) => {
            router.push(TAB_PATHS[key as keyof typeof TAB_PATHS]);
          }}
        />
      </div>
    </div>
  );
}

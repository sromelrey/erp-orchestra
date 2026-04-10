'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from '@/components/ui/sidebar';
import { CUSTOMER_PORTAL_MENU_ITEMS } from './sidebar.config';
import { useLogout } from '../../hooks/useLogout';
import { LogOut, ChevronRight } from 'lucide-react';
import { useSelector } from 'react-redux';
import {
  selectUserPermissions,
  selectCurrentUser,
  selectIsInitialized,
} from '@/store/slices/authSlice';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export function AppSidebar() {
  const pathname = usePathname();
  const { logout } = useLogout();
  const permissions = useSelector(selectUserPermissions);
  const user = useSelector(selectCurrentUser);
  const isInitialized = useSelector(selectIsInitialized);
  const isSystemAdmin = user?.isSystemAdmin;

  // Filter menu items based on permissions (System Admins see everything)
  const filteredItems = React.useMemo(() => {
    console.log('[AppSidebar] Debug info:', {
      isSystemAdmin,
      permissions: permissions.slice(0, 5), // Show first 5 permissions
      totalPermissions: permissions.length,
      hasGoodsReceiptPermission: permissions.includes('operations.goods-receipt.view')
    });

    return CUSTOMER_PORTAL_MENU_ITEMS.map((item) => {
      // 1. Check parent permission
      const hasParentAccess =
        isSystemAdmin || !item.permission || permissions.includes(item.permission);

      // Debug for Operations menu
      if (item.menu_code === 'OPS') {
        console.log('[AppSidebar] Operations menu:', {
          menu_code: item.menu_code,
          hasParentAccess,
          permission: item.permission,
          childrenCount: item.children?.length || 0
        });
      }

      // 2. Filter children if they exist
      if (item.children) {
        const visibleChildren = item.children.filter(
          (child) => {
            const hasAccess = isSystemAdmin || !child.permission || permissions.includes(child.permission);
            // Debug for Goods Receipts specifically
            if (child.menu_code === 'CP-06-05') {
              console.log('[AppSidebar] Goods Receipts child:', {
                menu_code: child.menu_code,
                label: child.label,
                permission: child.permission,
                hasAccess,
                isSystemAdmin,
                permissionInList: child.permission ? permissions.includes(child.permission) : false
              });
            }
            return hasAccess;
          }
        );

        // Return item with filtered children if it should be visible
        if (visibleChildren.length > 0) {
          return { ...item, children: visibleChildren };
        }

        // If parent has no visible children and no direct href, hide it
        if (!item.href) return null;
      }

      // 3. For items without children (or only parent fallback), check parent access
      return hasParentAccess ? item : null;
    }).filter((item): item is NonNullable<typeof item> => item !== null);
  }, [permissions, isSystemAdmin]);

  if (!isInitialized) {
    return null;
  }

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-lg font-bold">O</span>
          </div>
          <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
            <span className="font-semibold text-lg">Orchestra</span>
            <span className="text-xs text-muted-foreground">Customer Portal</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => {
                const isActive =
                  (item.href ? pathname.startsWith(item.href) : false) ||
                  (item.children?.some((child) =>
                    child.href ? pathname.startsWith(child.href) : false
                  ) ??
                    false);

                if (item.children) {
                  return (
                    <Collapsible
                      key={item.menu_code}
                      asChild
                      defaultOpen={isActive}
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            isActive={isActive}
                            onClick={() => {
                              if (item.menu_code === 'CP-04-04') {
                                console.log('[Sidebar] Employees menu clicked', {
                                  pathname,
                                  isActive,
                                  childrenCount: item.children?.length ?? 0,
                                });
                              }
                            }}
                          >
                            {item.icon && <item.icon />}
                            {item.href ? (
                              <Link href={item.href} className="flex-1">
                                <span>{item.label}</span>
                              </Link>
                            ) : (
                              <span className="flex-1">{item.label}</span>
                            )}
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.children.map((subItem) => {
                              const subItemIsActive =
                                (subItem.href ? pathname.startsWith(subItem.href) : false) ||
                                (subItem.children?.some((child) =>
                                  child.href ? pathname.startsWith(child.href) : false
                                ) ??
                                  false);

                              if (subItem.children && subItem.children.length > 0) {
                                // Nested collapsible
                                return (
                                  <Collapsible
                                    key={subItem.menu_code}
                                    asChild
                                    defaultOpen={subItemIsActive}
                                    className="group/nested-collapsible"
                                  >
                                    <SidebarMenuSubItem>
                                      <CollapsibleTrigger asChild>
                                        <SidebarMenuButton
                                          size="sm"
                                          isActive={subItemIsActive}
                                          onClick={() => {
                                            if (subItem.menu_code === 'CP-04-04') {
                                              console.log('[Sidebar] Employees submenu clicked', {
                                                pathname,
                                                isActive: subItemIsActive,
                                                childrenCount: subItem.children?.length ?? 0,
                                              });
                                            }
                                          }}
                                        >
                                          {subItem.icon && <subItem.icon />}
                                          <span className="flex-1">{subItem.label}</span>
                                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/nested-collapsible:rotate-90" />
                                        </SidebarMenuButton>
                                      </CollapsibleTrigger>
                                      <CollapsibleContent>
                                        <SidebarMenuSub>
                                          {subItem.children.map((nestedItem) => (
                                            <SidebarMenuSubItem key={nestedItem.menu_code}>
                                              <SidebarMenuSubButton
                                                asChild
                                                size="sm"
                                                isActive={
                                                  nestedItem.href
                                                    ? pathname.startsWith(nestedItem.href)
                                                    : false
                                                }
                                              >
                                                <Link href={nestedItem.href || '#'}>
                                                  {nestedItem.icon && <nestedItem.icon />}
                                                  <span>{nestedItem.label}</span>
                                                </Link>
                                              </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                          ))}
                                        </SidebarMenuSub>
                                      </CollapsibleContent>
                                    </SidebarMenuSubItem>
                                  </Collapsible>
                                );
                              }

                              // Simple submenu item
                              return (
                                <SidebarMenuSubItem key={subItem.menu_code}>
                                  <SidebarMenuSubButton
                                    asChild
                                    isActive={
                                      subItem.href ? pathname.startsWith(subItem.href) : false
                                    }
                                  >
                                    <Link href={subItem.href || '#'}>
                                      {subItem.icon && <subItem.icon />}
                                      <span>{subItem.label}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              );
                            })}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }

                return (
                  <SidebarMenuItem key={item.menu_code}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.label}
                      isActive={pathname === item.href}
                    >
                      <Link href={item.href || '#'}>
                        {item.icon && <item.icon />}
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 shadow-[0_-1px_2px_0_rgba(0,0,0,0.05)]">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => logout()}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              tooltip="Sign Out"
            >
              <LogOut className="size-4" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

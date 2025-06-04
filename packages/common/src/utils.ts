import { MicroAppConfig } from "./types";

/**
 * 判断是否是子应用路由
 * @param path 路径
 * @param prefix 子应用路径前缀，默认为/sub-app/
 * @returns 是否是子应用路由
 */
export function isSubAppRoute(
  path: string,
  prefix: string = "/sub-app/"
): boolean {
  return path.startsWith(prefix);
}

/**
 * 根据路径获取子应用配置
 * @param path 路径
 * @param microApps 子应用配置列表
 * @returns 子应用配置或undefined
 */
export function getSubAppByPath(
  path: string,
  microApps: MicroAppConfig[]
): MicroAppConfig | undefined {
  return microApps.find((app) => path.startsWith(app.activeRule));
}

/**
 * 从路径中提取子应用名称
 * @param path 路径
 * @param prefix 子应用路径前缀，默认为/sub-app/
 * @returns 子应用名称或null
 */
export function extractSubAppName(
  path: string,
  prefix: string = "/sub-app/"
): string | null {
  if (!isSubAppRoute(path, prefix)) {
    return null;
  }

  const match = path.match(new RegExp(`^${prefix}([^/]+)`));
  return match ? match[1] : null;
}

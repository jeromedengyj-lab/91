import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

export type Lang = "zh" | "en";

const STORAGE_KEY = "91play:lang";

const zh: Record<string, string> = {
  "brand.name": "91Play",

  // nav
  "nav.shorts": "短视频",
  "nav.videos": "视频",
  "nav.upload": "上传",
  "nav.admin": "后台",
  "nav.logout": "退出",
  "nav.openMenu": "打开菜单",
  "nav.closeMenu": "关闭菜单",

  // home
  "home.recommend": "随机推荐",
  "home.latest": "最新视频",
  "home.aria": "首页视频",
  "home.empty": "当前库中没有视频",
  "home.emptyFiltered": "未查询到",
  "home.refresh": "刷新首页",
  "home.searchPrefix": "搜索",
  "home.tagPrefix": "标签",
  "home.title": "首页",

  // listing
  "listing.searchPrefix": "搜索",
  "listing.tagPrefix": "标签",
  "listing.title": "视频列表",

  // search
  "search.placeholder": "搜索视频标题或作者",
  "search.ariaKeyword": "搜索关键词",
  "search.submit": "搜索",
  "search.clear": "清空搜索",

  // footer
  "footer.copyright": "© {year} 91Play",

  // share
  "share.loading": "正在加载",
  "share.linkExpired": "当前链接已失效",
  "share.loadFailed": "暂时无法加载",
  "share.ariaVideo": "分享的视频",

  // video detail
  "detail.notFound": "视频不存在",
  "detail.notFoundOrRemoved": "视频不存在或已被移除",
  "detail.retry": "重试",
  "detail.loadFailed": "视频信息暂时无法加载，请稍后重试",
  "detail.recommendFailed": "推荐视频加载失败，请稍后重试",
  "detail.tagsFailed": "标签加载失败，请稍后重试",
  "detail.deleteFailed": "删除失败，请稍后重试。",
  "detail.deleteFailedNoPerm": "删除失败，源文件未能删除，请检查WebDAV是否有删除权限",

  // actions
  "actions.video": "视频操作",
  "actions.likeDislike": "点赞和点踩",
  "actions.like": "点赞",
  "actions.dislike": "点踩",
  "actions.unlike": "取消点赞",
  "actions.undislike": "取消点踩",
  "actions.copyShare": "生成并复制一次性分享链接",
  "actions.shareCopied": "复制已生成的一次性分享链接",
  "actions.generating": "生成中",
  "actions.linkCopied": "链接已复制",
  "actions.copyAgain": "再次点击复制",
  "actions.copyRetry": "复制失败，重试",
  "actions.shareRetry": "分享失败，重试",
  "actions.share": "分享",
  "actions.deleteVideo": "删除这个视频",
  "actions.deleting": "删除中",
  "actions.delete": "删除",
  "actions.shareToastCopied": "已复制一次性分享链接",
  "actions.clickAgainShare": "请再次点击分享按钮",

  // upload
  "upload.title": "上传视频",
  "upload.queued": "排队中",
  "upload.downloading": "下载中",
  "upload.validating": "校验中",
  "upload.saving": "入库中",
  "upload.completed": "已完成",
  "upload.failed": "失败",
  "upload.canceled": "已取消",
  "upload.listLoadFailed": "任务列表加载失败",
  "upload.directLinkFailed": "创建直链任务失败",
  "upload.uploadFailedInvalid": "上传失败，请检查文件格式后重试",
  "upload.cancelFailed": "取消任务失败",
  "upload.modeAria": "上传方式",
  "upload.uploading": "上传中",
  "upload.upload": "上传",
  "upload.canceledCleaned": "任务已取消，临时文件已清理",
  "upload.creating": "创建中",
  "upload.createTask": "创建任务",
  "upload.canceling": "正在取消",
  "upload.waitingQueue": "等待前序任务完成",
  "upload.validatingStream": "正在确认视频流与文件格式",
  "upload.savingLibrary": "正在写入视频库并创建媒体任务",
  "upload.doneImport": "下载和入库完成",
  "upload.sizeUnknown": "远程大小未知",
};

const en: Record<string, string> = {
  "brand.name": "91Play",

  // nav
  "nav.shorts": "Shorts",
  "nav.videos": "Videos",
  "nav.upload": "Upload",
  "nav.admin": "Admin",
  "nav.logout": "Log out",
  "nav.openMenu": "Open menu",
  "nav.closeMenu": "Close menu",

  // home
  "home.recommend": "Random picks",
  "home.latest": "Latest videos",
  "home.aria": "Home videos",
  "home.empty": "No videos in the library yet",
  "home.emptyFiltered": "No results",
  "home.refresh": "Refresh home",
  "home.searchPrefix": "Search",
  "home.tagPrefix": "Tag",
  "home.title": "Home",

  // listing
  "listing.searchPrefix": "Search",
  "listing.tagPrefix": "Tag",
  "listing.title": "Video list",

  // search
  "search.placeholder": "Search video title or author",
  "search.ariaKeyword": "Search keywords",
  "search.submit": "Search",
  "search.clear": "Clear search",

  // footer
  "footer.copyright": "© {year} 91Play",

  // share
  "share.loading": "Loading",
  "share.linkExpired": "This link has expired",
  "share.loadFailed": "Failed to load",
  "share.ariaVideo": "Shared video",

  // video detail
  "detail.notFound": "Video not found",
  "detail.notFoundOrRemoved": "Video not found or removed",
  "detail.retry": "Retry",
  "detail.loadFailed": "Video info failed to load. Please try again later.",
  "detail.recommendFailed": "Failed to load recommendations. Please try again later.",
  "detail.tagsFailed": "Failed to load tags. Please try again later.",
  "detail.deleteFailed": "Delete failed. Please try again later.",
  "detail.deleteFailedNoPerm": "Delete failed. The source file could not be removed. Check if your WebDAV account has delete permission.",

  // actions
  "actions.video": "Video actions",
  "actions.likeDislike": "Like and dislike",
  "actions.like": "Like",
  "actions.dislike": "Dislike",
  "actions.unlike": "Unlike",
  "actions.undislike": "Undo dislike",
  "actions.copyShare": "Generate and copy one-time share link",
  "actions.shareCopied": "Copy the generated one-time share link",
  "actions.generating": "Generating…",
  "actions.linkCopied": "Link copied",
  "actions.copyAgain": "Click again to copy",
  "actions.copyRetry": "Copy failed, retry",
  "actions.shareRetry": "Share failed, retry",
  "actions.share": "Share",
  "actions.deleteVideo": "Delete this video",
  "actions.deleting": "Deleting…",
  "actions.delete": "Delete",
  "actions.shareToastCopied": "One-time share link copied",
  "actions.clickAgainShare": "Please click the share button again",

  // upload
  "upload.title": "Upload video",
  "upload.queued": "Queued",
  "upload.downloading": "Downloading",
  "upload.validating": "Validating",
  "upload.saving": "Importing",
  "upload.completed": "Completed",
  "upload.failed": "Failed",
  "upload.canceled": "Canceled",
  "upload.listLoadFailed": "Failed to load task list",
  "upload.directLinkFailed": "Failed to create direct-link task",
  "upload.uploadFailedInvalid": "Upload failed. Check the file format and try again.",
  "upload.cancelFailed": "Failed to cancel task",
  "upload.modeAria": "Upload method",
  "upload.uploading": "Uploading…",
  "upload.upload": "Upload",
  "upload.canceledCleaned": "Task canceled. Temporary files have been cleaned up.",
  "upload.creating": "Creating…",
  "upload.createTask": "Create task",
  "upload.canceling": "Canceling…",
  "upload.waitingQueue": "Waiting for earlier tasks to finish",
  "upload.validatingStream": "Checking video stream and file format",
  "upload.savingLibrary": "Importing into library and creating media task",
  "upload.doneImport": "Downloaded and imported",
  "upload.sizeUnknown": "remote size unknown",
};

export const messages: Record<Lang, Record<string, string>> = { zh, en };

interface I18nValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nValue>({
  lang: "zh",
  setLang: () => {},
  t: (key) => key,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "en" ? "en" : "zh";
    } catch {
      return "zh";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore
    }
    document.documentElement.lang = lang === "en" ? "en" : "zh-CN";
  }, [lang]);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      let text = messages[lang][key] ?? messages.zh[key] ?? key;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          text = text.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
        }
      }
      return text;
    },
    [lang]
  );

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}

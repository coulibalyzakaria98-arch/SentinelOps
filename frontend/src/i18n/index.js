import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Traductions directement intégrées (solution plus fiable)
const resources = {
  fr: {
    translation: {
      "app": {
        "name": "SentinelOps",
        "title": "Centre de commandement unifié",
        "tagline": "Système de réponse aux crises"
      },
      "status": {
        "system": "État du système",
        "nominal": "NOMINAL",
        "degraded": "DÉGRADÉ",
        "critical": "CRITIQUE",
        "offline": "HORS LIGNE",
        "online": "EN LIGNE",
        "sync": "Synchronisation",
        "lastSync": "Dernière synchronisation"
      },
      "dashboard": {
        "command": "Centre de commandement",
        "analytics": "Centre d'analyse",
        "field": "Terrain",
        "intel": "Renseignements au sol",
        "activeUnits": "Unités actives",
        "fusionScore": "Score de fusion",
        "tempo": "Statut tempo",
        "uptime": "Disponibilité"
      },
      "map": {
        "title": "Carte tactique",
        "hotspots": "Points chauds",
        "legend": "Légende",
        "critical": "Critique",
        "high": "Élevé",
        "medium": "Modéré",
        "low": "Faible",
        "coordinates": "Coordonnées",
        "search": "Rechercher une zone"
      },
      "alerts": {
        "title": "Alertes critiques",
        "critical": "CRITIQUE",
        "urgent": "URGENT",
        "moderate": "MODÉRÉ",
        "info": "INFORMATION",
        "zone": "Zone",
        "action": "Action requise",
        "noAlerts": "Aucune alerte critique",
        "timestamp": "Il y a"
      },
      "filters": {
        "title": "Filtres tactiques",
        "global": "Vue globale",
        "fires": "Incendies",
        "floods": "Inondations",
        "earthquakes": "Tremblements",
        "conflicts": "Conflits",
        "infrastructure": "Infrastructures",
        "reset": "Réinitialiser"
      },
      "simulator": {
        "title": "Simulateur stratégique",
        "propagation": "Propagation estimée",
        "speed": "km/h",
        "direction": "Direction",
        "risk": "Risque",
        "worstCase": "Le pire des cas",
        "stability": "Stabilité"
      },
      "ast": {
        "title": "Conseiller stratégique tactique",
        "analysis": "Analyse en cours",
        "recommendation": "Recommandation",
        "details": "Détails"
      },
      "export": {
        "title": "Exporter le rapport",
        "pdf": "Export PDF",
        "csv": "Export CSV",
        "geojson": "Export GeoJSON",
        "options": "Options d'export",
        "orientation": "Orientation",
        "portrait": "Portrait",
        "landscape": "Paysage",
        "quality": "Qualité",
        "include": "Inclure",
        "timestamp": "Horodatage",
        "footer": "Pied de page"
      },
      "offline": {
        "title": "Mode hors ligne actif",
        "message": "Les rapports seront sauvegardés localement",
        "sync": "Rapports en attente",
        "syncNow": "Synchroniser maintenant"
      },
      "buttons": {
        "submit": "Transmettre",
        "cancel": "Annuler",
        "save": "Sauvegarder",
        "delete": "Supprimer",
        "edit": "Modifier",
        "refresh": "Rafraîchir",
        "export": "Exporter",
        "print": "Imprimer"
      },
      "errors": {
        "generic": "Une erreur est survenue",
        "network": "Erreur réseau",
        "offline": "Vous êtes hors ligne",
        "notFound": "Page non trouvée",
        "unauthorized": "Accès non autorisé"
      },
      "time": {
        "now": "À l'instant",
        "minute": "minute",
        "minutes": "minutes",
        "hour": "heure",
        "hours": "heures",
        "day": "jour",
        "days": "jours"
      }
    }
  },
  en: {
    translation: {
      "app": {
        "name": "SentinelOps",
        "title": "Unified Command Center",
        "tagline": "Crisis Response System"
      },
      "status": {
        "system": "System Status",
        "nominal": "NOMINAL",
        "degraded": "DEGRADED",
        "critical": "CRITICAL",
        "offline": "OFFLINE",
        "online": "ONLINE",
        "sync": "Synchronization",
        "lastSync": "Last sync"
      },
      "dashboard": {
        "command": "Command Center",
        "analytics": "Analytics Center",
        "field": "Field Operations",
        "intel": "Ground Intelligence",
        "activeUnits": "Active Units",
        "fusionScore": "Fusion Score",
        "tempo": "Tempo Status",
        "uptime": "Uptime"
      },
      "map": {
        "title": "Tactical Map",
        "hotspots": "Hotspots",
        "legend": "Legend",
        "critical": "Critical",
        "high": "High",
        "medium": "Medium",
        "low": "Low",
        "coordinates": "Coordinates",
        "search": "Search area"
      },
      "alerts": {
        "title": "Critical Alerts",
        "critical": "CRITICAL",
        "urgent": "URGENT",
        "moderate": "MODERATE",
        "info": "INFORMATION",
        "zone": "Zone",
        "action": "Action required",
        "noAlerts": "No critical alerts",
        "timestamp": "ago"
      },
      "filters": {
        "title": "Tactical Filters",
        "global": "Global view",
        "fires": "Fires",
        "floods": "Floods",
        "earthquakes": "Earthquakes",
        "conflicts": "Conflicts",
        "infrastructure": "Infrastructure",
        "reset": "Reset"
      },
      "simulator": {
        "title": "Strategic Simulator",
        "propagation": "Estimated propagation",
        "speed": "km/h",
        "direction": "Direction",
        "risk": "Risk",
        "worstCase": "Worst case",
        "stability": "Stability"
      },
      "ast": {
        "title": "Tactical Strategic Advisor",
        "analysis": "Analysis in progress",
        "recommendation": "Recommendation",
        "details": "Details"
      },
      "export": {
        "title": "Export Report",
        "pdf": "PDF Export",
        "csv": "CSV Export",
        "geojson": "GeoJSON Export",
        "options": "Export options",
        "orientation": "Orientation",
        "portrait": "Portrait",
        "landscape": "Landscape",
        "quality": "Quality",
        "include": "Include",
        "timestamp": "Timestamp",
        "footer": "Footer"
      },
      "offline": {
        "title": "Offline mode active",
        "message": "Reports will be saved locally",
        "sync": "Pending reports",
        "syncNow": "Sync now"
      },
      "buttons": {
        "submit": "Submit",
        "cancel": "Cancel",
        "save": "Save",
        "delete": "Delete",
        "edit": "Edit",
        "refresh": "Refresh",
        "export": "Export",
        "print": "Print"
      },
      "errors": {
        "generic": "An error occurred",
        "network": "Network error",
        "offline": "You are offline",
        "notFound": "Page not found",
        "unauthorized": "Unauthorized access"
      },
      "time": {
        "now": "Just now",
        "minute": "minute",
        "minutes": "minutes",
        "hour": "hour",
        "hours": "hours",
        "day": "day",
        "days": "days"
      }
    }
  },
  es: {
    translation: {
      "app": {
        "name": "SentinelOps",
        "title": "Centro de Comando Unificado",
        "tagline": "Sistema de Respuesta a Crisis"
      },
      "status": {
        "system": "Estado del Sistema",
        "nominal": "NOMINAL",
        "degraded": "DEGRADADO",
        "critical": "CRÍTICO",
        "offline": "FUERA DE LÍNEA",
        "online": "EN LÍNEA",
        "sync": "Sincronización",
        "lastSync": "Última sincronización"
      },
      "dashboard": {
        "command": "Centro de Comando",
        "analytics": "Centro de Análisis",
        "field": "Operaciones de Campo",
        "intel": "Inteligencia Terrestre",
        "activeUnits": "Unidades Activas",
        "fusionScore": "Puntuación de Fusión",
        "tempo": "Estado Tempo",
        "uptime": "Tiempo Activo"
      },
      "map": {
        "title": "Mapa Táctico",
        "hotspots": "Puntos Calientes",
        "legend": "Leyenda",
        "critical": "Crítico",
        "high": "Alto",
        "medium": "Medio",
        "low": "Bajo",
        "coordinates": "Coordenadas",
        "search": "Buscar área"
      },
      "alerts": {
        "title": "Alertas Críticas",
        "critical": "CRÍTICO",
        "urgent": "URGENTE",
        "moderate": "MODERADO",
        "info": "INFORMACIÓN",
        "zone": "Zona",
        "action": "Acción requerida",
        "noAlerts": "No hay alertas críticas",
        "timestamp": "hace"
      },
      "filters": {
        "title": "Filtros Tácticos",
        "global": "Vista global",
        "fires": "Incendios",
        "floods": "Inundaciones",
        "earthquakes": "Terremotos",
        "conflicts": "Conflictos",
        "infrastructure": "Infraestructuras",
        "reset": "Restablecer"
      },
      "simulator": {
        "title": "Simulador Estratégico",
        "propagation": "Propagación estimada",
        "speed": "km/h",
        "direction": "Dirección",
        "risk": "Riesgo",
        "worstCase": "Peor caso",
        "stability": "Estabilidad"
      },
      "ast": {
        "title": "Asesor Estratégico Táctico",
        "analysis": "Análisis en curso",
        "recommendation": "Recomendación",
        "details": "Detalles"
      },
      "export": {
        "title": "Exportar Informe",
        "pdf": "Exportar PDF",
        "csv": "Exportar CSV",
        "geojson": "Exportar GeoJSON",
        "options": "Opciones de exportación",
        "orientation": "Orientación",
        "portrait": "Retrato",
        "landscape": "Paisaje",
        "quality": "Calidad",
        "include": "Incluir",
        "timestamp": "Marca de tiempo",
        "footer": "Pie de página"
      },
      "offline": {
        "title": "Modo fuera de línea activo",
        "message": "Los informes se guardarán localmente",
        "sync": "Informes pendientes",
        "syncNow": "Sincronizar ahora"
      },
      "buttons": {
        "submit": "Enviar",
        "cancel": "Cancelar",
        "save": "Guardar",
        "delete": "Eliminar",
        "edit": "Editar",
        "refresh": "Actualizar",
        "export": "Exportar",
        "print": "Imprimir"
      },
      "errors": {
        "generic": "Ocurrió un error",
        "network": "Error de red",
        "offline": "Estás fuera de línea",
        "notFound": "Página no encontrada",
        "unauthorized": "Acceso no autorizado"
      },
      "time": {
        "now": "Ahora mismo",
        "minute": "minuto",
        "minutes": "minutos",
        "hour": "hora",
        "hours": "horas",
        "day": "día",
        "days": "días"
      }
    }
  },
  ru: {
    translation: {
      "app": {
        "name": "SentinelOps",
        "title": "Командный центр",
        "tagline": "Система реагирования на кризисы"
      },
      "status": {
        "system": "Статус системы",
        "nominal": "НОРМАЛЬНО",
        "degraded": "СНИЖЕНА",
        "critical": "КРИТИЧЕСКИ",
        "offline": "ОФЛАЙН",
        "online": "ОНЛАЙН",
        "sync": "Синхронизация",
        "lastSync": "Последняя синхронизация"
      },
      "dashboard": {
        "command": "Командный центр",
        "analytics": "Аналитический центр",
        "field": "Полевые операции",
        "intel": "Наземная разведка",
        "activeUnits": "Активные подразделения",
        "fusionScore": "Оценка слияния",
        "tempo": "Статус темпа",
        "uptime": "Время работы"
      },
      "map": {
        "title": "Тактическая карта",
        "hotspots": "Горячие точки",
        "legend": "Легенда",
        "critical": "Критический",
        "high": "Высокий",
        "medium": "Средний",
        "low": "Низкий",
        "coordinates": "Координаты",
        "search": "Поиск области"
      },
      "alerts": {
        "title": "Критические оповещения",
        "critical": "КРИТИЧЕСКИ",
        "urgent": "СРОЧНО",
        "moderate": "УМЕРЕННЫЙ",
        "info": "ИНФОРМАЦИЯ",
        "zone": "Зона",
        "action": "Требуется действие",
        "noAlerts": "Нет критических оповещений",
        "timestamp": "назад"
      },
      "filters": {
        "title": "Тактические фильтры",
        "global": "Общий вид",
        "fires": "Пожары",
        "floods": "Наводнения",
        "earthquakes": "Землетрясения",
        "conflicts": "Конфликты",
        "infrastructure": "Инфраструктура",
        "reset": "Сбросить"
      },
      "simulator": {
        "title": "Стратегический симулятор",
        "propagation": "Распространение",
        "speed": "км/ч",
        "direction": "Направление",
        "risk": "Риск",
        "worstCase": "Худший случай",
        "stability": "Стабильность"
      },
      "ast": {
        "title": "Тактический стратегический советник",
        "analysis": "Анализ выполняется",
        "recommendation": "Рекомендация",
        "details": "Подробности"
      },
      "export": {
        "title": "Экспорт отчета",
        "pdf": "Экспорт PDF",
        "csv": "Экспорт CSV",
        "geojson": "Экспорт GeoJSON",
        "options": "Параметры экспорта",
        "orientation": "Ориентация",
        "portrait": "Портретная",
        "landscape": "Альбомная",
        "quality": "Качество",
        "include": "Включить",
        "timestamp": "Временная метка",
        "footer": "Нижний колонтитул"
      },
      "offline": {
        "title": "Режим офлайн активен",
        "message": "Отчеты будут сохранены локально",
        "sync": "Ожидающие отчеты",
        "syncNow": "Синхронизировать сейчас"
      },
      "buttons": {
        "submit": "Отправить",
        "cancel": "Отмена",
        "save": "Сохранить",
        "delete": "Удалить",
        "edit": "Редактировать",
        "refresh": "Обновить",
        "export": "Экспорт",
        "print": "Печать"
      },
      "errors": {
        "generic": "Произошла ошибка",
        "network": "Сетевая ошибка",
        "offline": "Вы офлайн",
        "notFound": "Страница не найдена",
        "unauthorized": "Несанкционированный доступ"
      },
      "time": {
        "now": "Только что",
        "minute": "минута",
        "minutes": "минуты",
        "hour": "час",
        "hours": "часов",
        "day": "день",
        "days": "дней"
      }
    }
  },
  zh: {
    translation: {
      "app": {
        "name": "SentinelOps",
        "title": "统一指挥中心",
        "tagline": "危机响应系统"
      },
      "status": {
        "system": "系统状态",
        "nominal": "正常",
        "degraded": "降级",
        "critical": "关键",
        "offline": "离线",
        "online": "在线",
        "sync": "同步",
        "lastSync": "最后同步"
      },
      "dashboard": {
        "command": "指挥中心",
        "analytics": "分析中心",
        "field": "现场行动",
        "intel": "地面情报",
        "activeUnits": "活跃单位",
        "fusionScore": "融合评分",
        "tempo": "节奏状态",
        "uptime": "运行时间"
      },
      "map": {
        "title": "战术地图",
        "hotspots": "热点",
        "legend": "图例",
        "critical": "关键",
        "high": "高",
        "medium": "中",
        "low": "低",
        "coordinates": "坐标",
        "search": "搜索区域"
      },
      "alerts": {
        "title": "关键警报",
        "critical": "关键",
        "urgent": "紧急",
        "moderate": "中等",
        "info": "信息",
        "zone": "区域",
        "action": "需要行动",
        "noAlerts": "无关键警报",
        "timestamp": "前"
      },
      "filters": {
        "title": "战术筛选",
        "global": "全局视图",
        "fires": "火灾",
        "floods": "洪水",
        "earthquakes": "地震",
        "conflicts": "冲突",
        "infrastructure": "基础设施",
        "reset": "重置"
      },
      "simulator": {
        "title": "战略模拟器",
        "propagation": "预计传播",
        "speed": "公里/小时",
        "direction": "方向",
        "risk": "风险",
        "worstCase": "最坏情况",
        "stability": "稳定性"
      },
      "ast": {
        "title": "战术战略顾问",
        "analysis": "分析进行中",
        "recommendation": "建议",
        "details": "详情"
      },
      "export": {
        "title": "导出报告",
        "pdf": "导出 PDF",
        "csv": "导出 CSV",
        "geojson": "导出 GeoJSON",
        "options": "导出选项",
        "orientation": "方向",
        "portrait": "纵向",
        "landscape": "横向",
        "quality": "质量",
        "include": "包括",
        "timestamp": "时间戳",
        "footer": "页脚"
      },
      "offline": {
        "title": "离线模式已激活",
        "message": "报告将本地保存",
        "sync": "待同步报告",
        "syncNow": "立即同步"
      },
      "buttons": {
        "submit": "提交",
        "cancel": "取消",
        "save": "保存",
        "delete": "删除",
        "edit": "编辑",
        "refresh": "刷新",
        "export": "导出",
        "print": "打印"
      },
      "errors": {
        "generic": "发生错误",
        "network": "网络错误",
        "offline": "您处于离线状态",
        "notFound": "页面未找到",
        "unauthorized": "未授权访问"
      },
      "time": {
        "now": "刚刚",
        "minute": "分钟",
        "minutes": "分钟",
        "hour": "小时",
        "hours": "小时",
        "day": "天",
        "days": "天"
      }
    }
  },
  ar: {
    translation: {
      "app": {
        "name": "SentinelOps",
        "title": "مركز القيادة الموحد",
        "tagline": "نظام الاستجابة للأزمات"
      },
      "status": {
        "system": "حالة النظام",
        "nominal": "طبيعي",
        "degraded": "متدهور",
        "critical": "حرج",
        "offline": "غير متصل",
        "online": "متصل",
        "sync": "مزامنة",
        "lastSync": "آخر مزامنة"
      },
      "dashboard": {
        "command": "مركز القيادة",
        "analytics": "مركز التحليلات",
        "field": "العمليات الميدانية",
        "intel": "الاستخبارات الميدانية",
        "activeUnits": "الوحدات النشطة",
        "fusionScore": "نتيجة الدمج",
        "tempo": "حالة الإيقاع",
        "uptime": "وقت التشغيل"
      },
      "map": {
        "title": "الخريطة التكتيكية",
        "hotspots": "النقاط الساخنة",
        "legend": "الإرشادات",
        "critical": "حرج",
        "high": "مرتفع",
        "medium": "متوسط",
        "low": "منخفض",
        "coordinates": "الإحداثيات",
        "search": "البحث عن منطقة"
      },
      "alerts": {
        "title": "تنبيهات حرجة",
        "critical": "حرج",
        "urgent": "عاجل",
        "moderate": "متوسط",
        "info": "معلومات",
        "zone": "المنطقة",
        "action": "إجراء مطلوب",
        "noAlerts": "لا توجد تنبيهات حرجة",
        "timestamp": "منذ"
      },
      "filters": {
        "title": "عوامل التصفية التكتيكية",
        "global": "عرض عام",
        "fires": "حرائق",
        "floods": "فيضانات",
        "earthquakes": "زلازل",
        "conflicts": "نزاعات",
        "infrastructure": "بنية تحتية",
        "reset": "إعادة تعيين"
      },
      "simulator": {
        "title": "محاكي استراتيجي",
        "propagation": "الانتشار المقدر",
        "speed": "كم/ساعة",
        "direction": "الاتجاه",
        "risk": "المخاطر",
        "worstCase": "أسوأ حالة",
        "stability": "الاستقرار"
      },
      "ast": {
        "title": "مستشار استراتيجي تكتيكي",
        "analysis": "التحليل قيد التقدم",
        "recommendation": "توصية",
        "details": "تفاصيل"
      },
      "export": {
        "title": "تصدير التقرير",
        "pdf": "تصدير PDF",
        "csv": "تصدير CSV",
        "geojson": "تصدير GeoJSON",
        "options": "خيارات التصدير",
        "orientation": "الاتجاه",
        "portrait": "عمودي",
        "landscape": "أفقي",
        "quality": "الجودة",
        "include": "تضمين",
        "timestamp": "الطابع الزمني",
        "footer": "تذييل"
      },
      "offline": {
        "title": "وضع عدم الاتصال نشط",
        "message": "سيتم حفظ التقارير محليًا",
        "sync": "تقارير معلقة",
        "syncNow": "مزامنة الآن"
      },
      "buttons": {
        "submit": "إرسال",
        "cancel": "إلغاء",
        "save": "حفظ",
        "delete": "حذف",
        "edit": "تعديل",
        "refresh": "تحديث",
        "export": "تصدير",
        "print": "طباعة"
      },
      "errors": {
        "generic": "حدث خطأ",
        "network": "خطأ في الشبكة",
        "offline": "أنت غير متصل",
        "notFound": "الصفحة غير موجودة",
        "unauthorized": "وصول غير مصرح به"
      },
      "time": {
        "now": "الآن",
        "minute": "دقيقة",
        "minutes": "دقائق",
        "hour": "ساعة",
        "hours": "ساعات",
        "day": "يوم",
        "days": "أيام"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr',
    debug: false,
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'sentinelops-language'
    },
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;

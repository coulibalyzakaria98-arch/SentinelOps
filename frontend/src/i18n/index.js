import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  fr: {
    translation: {
      "app": {
        "name": "SentinelOps",
        "title": "Centre de commandement unifié",
        "tagline": "Système de réponse aux crises",
        "field": "Terrain"
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
      "field": {
        "tactical_title": "Titre Tactique",
        "intel_terrain": "Intelligence Terrain",
        "severity_level": "Niveau de Gravité",
        "classification": "Classification",
        "gps_fixing": "Localisation GPS...",
        "photo": "Photo",
        "transmit": "Transmettre",
        "save": "Sauvegarder",
        "sos_signal": "SIGNAL SOS",
        "sos_confirm": "Lancer l'alerte SOS immédiate ?",
        "success_msg": "Rapport envoyé avec succès !",
        "offline_msg": "Rapport sauvegardé (Hors ligne)",
        "placeholders": {
          "title": "Ex: Effondrement Secteur Alpha",
          "intel": "Détails de l'incident..."
        },
        "severity": {
          "minimal": "Minime",
          "partial": "Partiel",
          "critical": "Critique"
        },
        "types": {
          "flood": "Inondation",
          "fire": "Incendie",
          "earthquake": "Séisme",
          "cyclone": "Cyclone",
          "conflict": "Conflit"
        }
      },
      "buttons": {
        "submit": "Transmettre",
        "cancel": "Annuler",
        "save": "Sauvegarder",
        "delete": "Supprimer"
      }
    }
  },
  en: {
    translation: {
      "app": {
        "name": "SentinelOps",
        "title": "Unified Command Center",
        "tagline": "Crisis Response System",
        "field": "Field"
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
      "field": {
        "tactical_title": "Tactical Title",
        "intel_terrain": "Field Intelligence",
        "severity_level": "Severity Level",
        "classification": "Classification",
        "gps_fixing": "Fixing GPS...",
        "photo": "Photo",
        "transmit": "Transmit",
        "save": "Save",
        "sos_signal": "SOS SIGNAL",
        "sos_confirm": "Trigger immediate SOS alert?",
        "success_msg": "Report sent successfully!",
        "offline_msg": "Report saved (Offline)",
        "placeholders": {
          "title": "E.g.: Alpha Sector Collapse",
          "intel": "Incident details..."
        },
        "severity": {
          "minimal": "Minimal",
          "partial": "Partial",
          "critical": "Critical"
        },
        "types": {
          "flood": "Flood",
          "fire": "Fire",
          "earthquake": "Earthquake",
          "cyclone": "Cyclone",
          "conflict": "Conflict"
        }
      },
      "buttons": {
        "submit": "Submit",
        "cancel": "Cancel",
        "save": "Save",
        "delete": "Delete"
      }
    }
  },
  ar: {
    translation: {
      "app": {
        "name": "سينتينل أوبس",
        "title": "مركز القيادة الموحد",
        "tagline": "نظام الاستجابة للأزمات",
        "field": "ميداني"
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
      "field": {
        "tactical_title": "العنوان التكتيكي",
        "intel_terrain": "الاستخبارات الميدانية",
        "severity_level": "مستوى الخطورة",
        "classification": "التصنيف",
        "gps_fixing": "تحديد الموقع...",
        "photo": "صورة",
        "transmit": "إرسال",
        "save": "حفظ",
        "sos_signal": "إشارة استغاثة",
        "sos_confirm": "إطلاق تنبيه استغاثة فوري؟",
        "success_msg": "تم إرسال التقرير بنجاح!",
        "offline_msg": "تم حفظ التقرير (بدون اتصال)",
        "placeholders": {
          "title": "مثال: انهيار في القطاع ألفا",
          "intel": "تفاصيل الحادث..."
        },
        "severity": {
          "minimal": "بسيط",
          "partial": "جزئي",
          "critical": "حرج"
        },
        "types": {
          "flood": "فيضان",
          "fire": "حريق",
          "earthquake": "زلزال",
          "cyclone": "إعصار",
          "conflict": "نزاع"
        }
      },
      "buttons": {
        "submit": "إرسال",
        "cancel": "إلغاء",
        "save": "حفظ",
        "delete": "حذف"
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

import i18n from "i18next";  // Imports the main i18next library for internationalization
import { initReactI18next } from "react-i18next";  // Imports the React-specific integration of i18next
import * as resources from "./resources";  // Imports all exports from a file named "resources.js"


i18n.use(initReactI18next).init({
    compatibilityJSON: "v3",
    resources: {
        ...Object.entries(resources).reduce(
            (acc, [key, value]) => ({
                ...acc,
                [key]: {
                    translation: value,
                },
            }),
            {}
        ),
    },
    lng: "en",
});

export default i18n;

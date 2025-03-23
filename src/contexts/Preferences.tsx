import {createContext, PropsWithChildren, useContext, useEffect, useState,} from "react";
import {noop} from "@/shared/utils";

export type ViewMode = "day" | "week" | "month";

export type PreferenceMap = {
    "show-welcome-message": boolean;
    "base-color": string;
    "view-mode": ViewMode;
    timezone: string;
    "last-viewed-date": string;
    "first-day-of-week": 0 | 1 | 2 | 3 | 4 | 5 | 6;
    "show-time": boolean;
    "date-time-format-locale": string;
    "date-time-format": Pick<
        Intl.DateTimeFormatOptions,
        "dateStyle" | "timeStyle"
    >;
};

export const DEFAULT_PREFERENCES: PreferenceMap = {
    "show-welcome-message": false,
    "base-color": "black",
    "view-mode": "month",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    "last-viewed-date": new Date().toISOString(),
    "first-day-of-week": 1,
    "show-time": false,
    "date-time-format-locale": 'es-ES',
    "date-time-format": {
        dateStyle: "medium",
        timeStyle: "short",
    },
};

export type PreferenceKey = keyof PreferenceMap;

type SetPreference = <const K extends PreferenceKey>(
    key: K,
    value: PreferenceMap[K]
) => void;

type SetSpecificPreference<K extends PreferenceKey> = (
    value: PreferenceMap[K]
) => void;

type PreferencesContextType = {
    preferences: PreferenceMap;
    setPreference: SetPreference;
    setPreferences: (preferences: PreferenceMap) => void;
    resetPreference: (key: PreferenceKey) => void;
    resetPreferences: () => void;
};

const PreferencesContext = createContext<PreferencesContextType>({
    preferences: DEFAULT_PREFERENCES,
    setPreference: noop,
    setPreferences: noop,
    resetPreference: noop,
    resetPreferences: noop,
});

export function usePreferences(): PreferencesContextType {
    return useContext(PreferencesContext);
}

export function usePreference<const K extends PreferenceKey>(
    key: K
): [PreferenceMap[K], SetSpecificPreference<K>] {
    const {preferences, setPreference} = usePreferences();
    return [preferences[key], (value) => setPreference(key, value)];
}

function setBaseColor(color: string): void {
    document.documentElement.style.setProperty("--base-color", color);

    const themeColorReference = document.getElementById("theme-color-reference");

    if (!themeColorReference) {
        return;
    }

    const themeColor =
        getComputedStyle(themeColorReference).getPropertyValue("background-color");

    document.head
        .querySelector(`meta[name="theme-color"]`)
        ?.setAttribute("content", themeColor);
}

export default function PreferencesProvider({children}: PropsWithChildren) {
    const [preferences, setPreferences] = useState<PreferenceMap>(DEFAULT_PREFERENCES);

    const setPreference: SetPreference = (key, value) => {
        setPreferences((prevPreferences) => {
            const newPreferences = {...prevPreferences, [key]: value};

            if (key === "base-color") {
                setBaseColor(value as string);
            }

            return newPreferences;
        });
    };

    const setContextPreferences = (newPreferences: PreferenceMap) => {
        setPreferences(() => {
            setBaseColor(newPreferences["base-color"]);
            return newPreferences;
        });
    };

    const resetPreference = (key: PreferenceKey) => {
        setPreferences((prevPreferences) => ({
            ...prevPreferences,
            [key]: DEFAULT_PREFERENCES[key]
        }));

        if (key === "base-color") {
            setBaseColor(DEFAULT_PREFERENCES["base-color"]);
        }
    };

    const resetPreferences = () => {
        setPreferences(DEFAULT_PREFERENCES);
        setBaseColor(DEFAULT_PREFERENCES["base-color"]);
    };

    useEffect(() => {
        setBaseColor(preferences["base-color"]);
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, []);

    return (
        <PreferencesContext.Provider
            value={{
                preferences,
                setPreference,
                resetPreference,
                resetPreferences,
                setPreferences: setContextPreferences,
            }}
        >
            {children}
        </PreferencesContext.Provider>
    );
}
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { useLocation } from "react-router-dom";
import {
  PARIS_LP_CALCULATED_OBJECTS_KEY,
  PARIS_LP_CALCULATED_VOLUME_KEY,
  PARIS_LP_FORM_DRAFT_KEY,
  clearParisLpSession,
  isParisLpActiveFlow,
} from "../../constants/parisLp";

export type ParisCompactDevisFormState = {
  nom: string;
  tel_portable: string;
  email: string;
  adresse_depart: string;
  cp_depart: string;
  etage_depart: string;
  ascenseur_depart: string;
  adresse_arrivee: string;
  cp_arrivee: string;
  etage_arrivee: string;
  ascenseur_arrivee: string;
  volume: string;
  superficie: string;
  liste_objets: string;
  date_demenagement: string;
  info_complementaire: string;
};

export const EMPTY_PARIS_DEVIS_FORM: ParisCompactDevisFormState = {
  nom: "",
  tel_portable: "",
  email: "",
  adresse_depart: "",
  cp_depart: "",
  etage_depart: "",
  ascenseur_depart: "",
  adresse_arrivee: "",
  cp_arrivee: "",
  etage_arrivee: "",
  ascenseur_arrivee: "",
  volume: "",
  superficie: "",
  liste_objets: "",
  date_demenagement: "",
  info_complementaire: "",
};

type ParisLpFormContextValue = {
  form: ParisCompactDevisFormState;
  setForm: Dispatch<SetStateAction<ParisCompactDevisFormState>>;
  showErrors: boolean;
  setShowErrors: Dispatch<SetStateAction<boolean>>;
  formSessionKey: number;
};

const ParisLpFormContext = createContext<ParisLpFormContextValue | null>(null);

function readParisLpFormDraft(): ParisCompactDevisFormState {
  try {
    const raw = sessionStorage.getItem(PARIS_LP_FORM_DRAFT_KEY);
    if (!raw) return { ...EMPTY_PARIS_DEVIS_FORM };
    const parsed = JSON.parse(raw) as Partial<ParisCompactDevisFormState>;
    return { ...EMPTY_PARIS_DEVIS_FORM, ...parsed };
  } catch {
    return { ...EMPTY_PARIS_DEVIS_FORM };
  }
}

function writeParisLpFormDraft(form: ParisCompactDevisFormState): void {
  sessionStorage.setItem(PARIS_LP_FORM_DRAFT_KEY, JSON.stringify(form));
}

export function ParisLpFormProvider({ children }: Readonly<{ children: ReactNode }>) {
  const location = useLocation();
  const [form, setForm] = useState<ParisCompactDevisFormState>(() => ({ ...EMPTY_PARIS_DEVIS_FORM }));
  const [showErrors, setShowErrors] = useState(false);
  const [formSessionKey, setFormSessionKey] = useState(0);

  useEffect(() => {
    if (!isParisLpActiveFlow()) {
      clearParisLpSession();
      setForm({ ...EMPTY_PARIS_DEVIS_FORM });
      setShowErrors(false);
      setFormSessionKey((key) => key + 1);
      return;
    }

    const storedVolume = sessionStorage.getItem(PARIS_LP_CALCULATED_VOLUME_KEY);
    const storedObjects = sessionStorage.getItem(PARIS_LP_CALCULATED_OBJECTS_KEY);

    setForm(() => {
      const next = {
        ...readParisLpFormDraft(),
        ...(storedVolume ? { volume: storedVolume } : {}),
        ...(storedObjects ? { liste_objets: storedObjects } : {}),
      };
      writeParisLpFormDraft(next);
      return next;
    });

    if (storedVolume) sessionStorage.removeItem(PARIS_LP_CALCULATED_VOLUME_KEY);
    if (storedObjects) sessionStorage.removeItem(PARIS_LP_CALCULATED_OBJECTS_KEY);
  }, [location.pathname]);

  return (
    <ParisLpFormContext.Provider value={{ form, setForm, showErrors, setShowErrors, formSessionKey }}>
      {children}
    </ParisLpFormContext.Provider>
  );
}

export function useParisLpFormContext(): ParisLpFormContextValue {
  const context = useContext(ParisLpFormContext);
  if (!context) {
    throw new Error("useParisLpFormContext must be used within ParisLpFormProvider");
  }
  return context;
}

export function useOptionalParisLpFormContext(): ParisLpFormContextValue | null {
  return useContext(ParisLpFormContext);
}

import { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import RouteGuard from "./components/RouteGuard";
import ScrollToTop from "./components/ScrollToTop";
import DevisEntryTracker from "./components/DevisEntryTracker";
import PDFReport, { type PDFReportHandles } from "./components/PDFReport";
import { FormDataManager } from "./utils/formDataManager";
import { apiFetch } from "./utils/clientAccess";
import HomePage from "./pages/HomeDesigned";
import Contact from "./pages/Contact";
import MentionsLegales from "./pages/MentionsLegales";
import Rgpd from "./pages/Rgpd";
import Solution from "./pages/Solution";
import Blog from "./pages/Blog";
import BlogArticle from "./pages/BlogArticle";
import FAQ from "./pages/FAQ";
import Tarification from "./pages/Tarification";
import FormulesDemenagement from "./pages/FormulesDemenagement";
import EnConstruction from "./pages/EnConstruction";
import DemenagementEntreprise from "./pages/DemenagementEntreprise";
import DemenagementParticulier from "./pages/DemenagementParticulier";
import ZoneIleDeFrance from "./pages/ZoneIleDeFrance";
import Paris from "./pages/paris";
import Seine92 from "./pages/seine92";
import Versaille from "./pages/versaille";
import LongueDistance from "./pages/longue";
import LongueDistanceSeo from "./pages/LongueDistanceSeo";
import Pro from "./pages/pro";  
import Particulier from "./pages/particulier";
import ZoneNational from "./pages/ZoneNational";
import ZoneInternational from "./pages/ZoneInternational";
import NotFound from "./pages/NotFound";
import { clearDevisEntryPage, getDevisEntryPageDisplay } from "./utils/devisEntry";
import {
  Phone,
  MapPin,
  User,
  Mail,
  Calendar,
  Check,
  Shield,
  Users,
  Clock,
  List,
  Camera,
  ArrowLeft,
  ChevronRight,
  Search,
  Plus,
  Minus,
  Package,
  Truck,
  Heart,
  ArrowDown,
  RefreshCw,
  Headphones,
  Scissors,
  Maximize2,
  Trash2,
  Zap,
  CheckCircle,
  AlertCircle,
  Home,
  Utensils,
  Bath,
  Bed,
  Sofa,
  Car,
  TreePine,
  Archive,
  Tag,
  Hash,
  Ruler,
} from "lucide-react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { AddressAutocomplete } from "./components/AddressAutocomplete";
import { getDistanceMatrix } from "./services/googleMapsApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { Slider } from "./components/ui/slider";
import { Switch } from "./components/ui/switch";
import { Checkbox } from "./components/ui/checkbox";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import Footer from "./components/layout/Footer";
import StickyContactButtons from "./components/StickyContactButtons";
import {
  AspirateurIcon,
  Armoire2pIcon,
  ArmoireAncienneIcon,
  ArmoireAncienneHeavyIcon,
  ArmoireForteHeavyIcon,
  BaignoireEnfantIcon,
  BarbecueIcon,
  BancDeMusculationIcon,
  BibliothequeIcon,
  BoiteOuPanierIcon,
  BuffetCompletHautBasIcon,
  BureauIcon,
  CaveAVinIcon,
  ChaiseBureauIcon,
  ChaiseIcon,
  ChiffronierIcon,
  ClimatisationIcon,
  CoffreRangementIcon,
  CoiffeuseIcon,
  ColonneSalleDeBainIcon,
  CommodeIcon,
  CuisiniereIcon,
  EcranOrdinateurIcon,
  EchelleIcon,
  EscabeauIcon,
  EtagereCaveIcon,
  EtagereCuisineIcon,
  FourIcon,
  FourPiano6TetesIcon,
  FrigoCongelateurIcon,
  GuitareIcon,
  ImprimanteIcon,
  ImprimanteProIcon,
  LampeDeBureauIcon,
  LaveLingeIcon,
  LaveLingeHeavyIcon,
  LaveVaisselleIcon,
  LitDoubleIcon,
  LitSimpleIcon,
  MeubleBasCuisineIcon,
  MeubleHautCuisineIcon,
  MeubleSalleDeBainIcon,
  MicroOndesIcon,
  MoyenneTableIcon,
  ParasolIcon,
  ParaventIcon,
  PianoDroitHeavyIcon,
  PianoQueueHeavyIcon,
  PlanteEnPotIcon,
  PoussetteIcon,
  RefrigerateurAmericainHeavyIcon,
  ScooterMotoIcon,
  SecheLingeIcon,
  TableALangerBebeIcon,
  TableDeJardinIcon,
  TableDeNuitIcon,
  TablePingPongIcon,
  TabouretIcon,
  TapisDeCourseIcon,
  TapisMoyenIcon,
  TapisPetitIcon,
  TeteDeLitIcon,
  TransatIcon,
  TvIcon,
  ValisesIcon,
  VaisselierIcon,
  VeloIcon,
  VeloInterieurIcon,
} from "./cuisineObjectIcons";

/** Numéro affiché dans l’en-tête du tunnel (mes-coordonnées, devis, etc.) — lien d’appel */
const TUNNEL_SUPPORT_PHONE_HREF = "tel:+33189703324";
const TUNNEL_SUPPORT_PHONE_DISPLAY = "+33 1 89 70 33 24";

/** YYYY-MM-DD in local timezone (avoids UTC off-by-one on date inputs). */
function getLocalDateString(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function clampToTodayOrLater(dateStr: string): string {
  const today = getLocalDateString();
  if (!dateStr || dateStr < today) return today;
  return dateStr;
}

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get current page from URL
  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === "/tunnel/mes-coordonnees") return "form";
    if (path === "/tunnel/choix-volume") return "methods";
    if (path === "/tunnel/mon-volume/liste") return "volume";
    if (path === "/tunnel/mon-volume/ai") return "volume";
    if (path === "/tunnel/mon-volume/surface") return "volume";
    if (path === "/tunnel/ai-results") return "ai-results";
    if (path === "/tunnel/adresses") return "addresses";
    if (path === "/tunnel/devis") return "quote";
    if (path === "/tunnel/devis/confirmation") return "quote-confirmation";
    if (path === "/tunnel/info") return "info";
    if (path === "/tunnel/options") return "options";
    return "form";
  };

  const getSelectedMethodFromUrl = () => {
    const path = location.pathname;
    if (path === "/tunnel/mon-volume/liste") return "list";
    if (path === "/tunnel/mon-volume/ai") return "photo";
    if (path === "/tunnel/mon-volume/surface") return "surface";
    return null;
  };

  const currentPage = getCurrentPage();

  // Update selectedMethod when URL changes and track last used method
  useEffect(() => {
    const methodFromUrl = getSelectedMethodFromUrl();
    if (methodFromUrl) {
      setSelectedMethod(methodFromUrl);
      setLastUsedMethod(methodFromUrl);
    }
  }, [location.pathname]);

  // Load existing form data on component mount
  useEffect(() => {
    const existingData = FormDataManager.getFormData();
    const resolvedLastName = (existingData.lastName ?? existingData.name ?? "") as string;
    if (existingData.firstName || resolvedLastName || existingData.email || existingData.phone) {
      setFormData(prev => ({
        ...prev,
        firstName: existingData.firstName || '',
        name: resolvedLastName || '',
        email: existingData.email || '',
        phone: existingData.phone || '',
        address: existingData.address || '',
        date: clampToTodayOrLater((existingData.date as string) || prev.date)
      }));
      // Sync saved address into addressData so "Au départ" is pre-filled on tunnel/adresses
      const savedAddress = existingData.address?.trim();
      if (savedAddress) {
        setAddressData(prev => ({
          ...prev,
          departure: { ...prev.departure, address: savedAddress },
        }));
      }
    }

    // Check if user has already submitted form (has clientId)
    const storedClientId = localStorage.getItem('clientId');
    if (storedClientId) {
      setClientId(parseInt(storedClientId));
    }
  }, []);

  // Pre-fill or clear address when coming from home page (obtenir un devis gratuit)
  useEffect(() => {
    if (location.pathname !== "/tunnel/mes-coordonnees") return;
    const cameFromHome = sessionStorage.getItem("cameFromHome");
    const homeAddress = sessionStorage.getItem("homeDepartureAddress");
    const homeFirstName = sessionStorage.getItem("homeFirstName");
    const homeLastName = sessionStorage.getItem("homeLastName");
    const homeEmail = sessionStorage.getItem("homeEmail");
    const homePhone = sessionStorage.getItem("homePhone");
    const homeMoveDate = sessionStorage.getItem("homeMoveDate");
    sessionStorage.removeItem("cameFromHome");
    sessionStorage.removeItem("homeDepartureAddress");
    sessionStorage.removeItem("homeFirstName");
    sessionStorage.removeItem("homeLastName");
    sessionStorage.removeItem("homeEmail");
    sessionStorage.removeItem("homePhone");
    sessionStorage.removeItem("homeMoveDate");

    if (cameFromHome) {
      if (homeFirstName && homeFirstName.trim()) {
        setFormData(prev => ({ ...prev, firstName: homeFirstName.trim() }));
        FormDataManager.saveFormData({ firstName: homeFirstName.trim() });
      }
      if (homeLastName && homeLastName.trim()) {
        setFormData(prev => ({ ...prev, name: homeLastName.trim() }));
        FormDataManager.saveFormData({ lastName: homeLastName.trim(), name: homeLastName.trim() });
      }
      if (homeEmail && homeEmail.trim()) {
        setFormData(prev => ({ ...prev, email: homeEmail.trim() }));
        FormDataManager.saveFormData({ email: homeEmail.trim() });
      }
      if (homePhone && homePhone.trim()) {
        setFormData(prev => ({ ...prev, phone: homePhone.trim() }));
        FormDataManager.saveFormData({ phone: homePhone.trim() });
      }
      if (homeMoveDate && homeMoveDate.trim()) {
        const date = clampToTodayOrLater(homeMoveDate.trim());
        setFormData(prev => ({ ...prev, date }));
        FormDataManager.saveFormData({ date });
      }
      if (homeAddress && homeAddress.trim()) {
        setFormData(prev => ({ ...prev, address: homeAddress.trim() }));
        setAddressData(prev => ({
          ...prev,
          departure: { ...prev.departure, address: homeAddress.trim() },
        }));
        FormDataManager.saveFormData({ address: homeAddress.trim() });
      } else {
        setFormData(prev => ({ ...prev, address: "" }));
        setAddressData(prev => ({
          ...prev,
          departure: { ...prev.departure, address: "" },
        }));
        FormDataManager.saveFormData({ address: "" });
      }
    }
  }, [location.pathname]);

  const [propertyValue, setPropertyValue] = useState(27000);
  const [selectedGuarantee, setSelectedGuarantee] = useState("1000");
  const [, setLastCalculationId] = useState<number | null>(null);
  const [, setLastAddressId] = useState<number | null>(null);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [distanceText, setDistanceText] = useState<string>("");
  const [distanceLoading, setDistanceLoading] = useState<boolean>(false);
  const [options, setOptions] = useState({
    packCartons: true,       // option 1 - included by default
    dateFlexible: false,
    prixFlexible: true,      // option 2 - included by default
    demontageRemontage: false,
    emballageFragile: false,
    emballageCartons: false,
    autorisationStationnement: true,  // option 6 - included by default
    transportVetements: true,         // option 7 - included by default
  });
  const [formData, setFormData] = useState({
    address: "",
    date: getLocalDateString(),
    name: "",
    firstName: "",
    email: "",
    phone: "",
  });
  const [clientId, setClientId] = useState<number | null>(null);
  const [sendingDevis, setSendingDevis] = useState(false);
  const [devisSent, setDevisSent] = useState(false);
  const pdfReportRef = useRef<PDFReportHandles | null>(null);

  const [selectedRoom, setSelectedRoom] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [surfaceArea, setSurfaceArea] = useState("");
  const [logementType, setLogementType] = useState<"aerien" | "normal" | "charge" | "">("");
  const [ancienneteLogement, setAncienneteLogement] = useState<"0_2" | "2_5" | "5_plus" | "">("");
  const [selectedMethod, setSelectedMethod] = useState<"list" | "photo" | "surface" | null>(getSelectedMethodFromUrl());
  const [lastUsedMethod, setLastUsedMethod] = useState<"list" | "photo" | "surface" | null>(null);
  const currentStepNumber =
    currentPage === "form"
      ? 1
      : currentPage === "methods" || currentPage === "volume" || currentPage === "ai-results"
        ? 2
        : 3;
  const stepItems = [
    { step: 1, title: "Mes informations", subtitle: "Vos coordonnées" },
    { step: 2, title: "Mon déménagement", subtitle: "Choix de méthode" },
    { step: 3, title: "Mes adresses", subtitle: "Départ et arrivée" },
  ] as const;
  const [declaredVolumeM3, setDeclaredVolumeM3] = useState<number | null>(() => {
    try {
      const v = localStorage.getItem('declaredVolumeM3');
      return v != null ? parseFloat(v) : null;
    } catch { return null; }
  });
  const [declaredVolumeMethod, setDeclaredVolumeMethod] = useState<"list" | "photo" | "surface" | null>(() => {
    try {
      const m = localStorage.getItem('declaredVolumeMethod');
      return (m === 'list' || m === 'photo' || m === 'surface') ? m : null;
    } catch { return null; }
  });
  const [cleaningQuantities, setCleaningQuantities] = useState<
    Record<string, number>
  >({});

  // Room-specific object quantities
  const [roomObjectQuantities, setRoomObjectQuantities] = useState<
    Record<string, Record<string, number>>
  >({});

  // AI Photo method state
  const [uploadedImages, setUploadedImages] = useState<Array<{
    id: string;
    file: File;
    preview: string;
    roomId: string;
  }>>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  type RoomObjectValue = number | { quantity: number; volume_per_unit: number; total_volume: number; is_ai_detected: boolean; confidence: number | null };
  const [roomAnalysisResults, setRoomAnalysisResults] = useState<Record<string, Record<string, RoomObjectValue>>>({});
  const [newObjectInputs, setNewObjectInputs] = useState<Record<string, string>>({});

  // Special objects state
  const [hasSpecialObjects, setHasSpecialObjects] = useState(false);
  const [specialObjectQuantities, setSpecialObjectQuantities] = useState<Record<string, number>>({});
  const [customRooms, setCustomRooms] = useState<string[]>([]);
  const [newRoomName, setNewRoomName] = useState("");
  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
  const [showAddPieceForm, setShowAddPieceForm] = useState(false);
  const [showAddHeavyObjectForm, setShowAddHeavyObjectForm] = useState(false);
  const [pieceForm, setPieceForm] = useState({
    nature: "",
    quantite: "",
    longueur: "",
    largeur: "",
    hauteur: ""
  });
  const [heavyObjectForm, setHeavyObjectForm] = useState({
    nature: "",
    quantite: "",
    longueur: "",
    largeur: "",
    hauteur: ""
  });

  // Store custom object details (dimensions, etc.)
  const [customObjectDetails, setCustomObjectDetails] = useState<Record<string, {
    name: string;
    quantity: number;
    length: number;
    width: number;
    height: number;
  }>>({});

  // Store custom heavy object details (dimensions, etc.)
  const [customHeavyObjectDetails, setCustomHeavyObjectDetails] = useState<Record<string, {
    name: string;
    quantity: number;
    length: number;
    width: number;
    height: number;
  }>>({});

  // Store AI method custom heavy object details (dimensions, etc.)
  const [aiCustomHeavyObjectDetails, setAiCustomHeavyObjectDetails] = useState<Record<string, {
    name: string;
    quantity: number;
    length: number;
    width: number;
    height: number;
  }>>({});

  // Store superficie method custom heavy object details (dimensions, etc.)
  const [superficieCustomHeavyObjectDetails, setSuperficieCustomHeavyObjectDetails] = useState<Record<string, {
    name: string;
    quantity: number;
    length: number;
    width: number;
    height: number;
  }>>({});

  const [addressData, setAddressData] = useState({
    departure: {
      address: "Paris, France",
      floor: "RDC",
      elevator: "Non",
      demiEtage: false,
      options: {
        monteMenuble: false,
        caveGarage: false,
        courTraverser: false,
        portageDistanceM: 0 as number,
      },
    },
    arrival: {
      address: "",
      floor: "RDC",
      elevator: "Non",
      demiEtage: false,
      options: {
        monteMenuble: false,
        caveGarage: false,
        courTraverser: false,
        portageDistanceM: 0 as number,
      },
    },
    preferStorage: false,
  });

  const [escales, setEscales] = useState<Array<{
    id: number;
    address: string;
    floor: string;
    elevator: string;
    demiEtage: boolean;
    options: {
      monteMenuble: boolean;
      caveGarage: boolean;
      courTraverser: boolean;
    };
  }>>([]);

  // Set default room for list method
  useEffect(() => {
    if (selectedMethod === "list" && !selectedRoom) {
      setSelectedRoom("Entrée");
    }
  }, [selectedMethod, selectedRoom]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Save data to localStorage for route protection
    FormDataManager.saveFormData({ [field]: value });
  };

  const handleSubmitForm = async () => {
    if (!formData.address.trim()) {
      alert('L\'adresse de départ est obligatoire');
      return;
    }

    // Save form data for route protection
    FormDataManager.saveFormData({
      firstName: formData.firstName.trim(),
      lastName: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      date: formData.date
    });

    if (formData.address.trim().length < 10) {
      alert('L\'adresse doit contenir au moins 10 caractères pour être valide');
      return;
    }

    // Validate date (must be today or in the future)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(formData.date);
    selectedDate.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      alert('La date de déménagement doit être aujourd\'hui ou dans le futur');
      return;
    }

    try {
      const clientData = {
        adresse_depart: formData.address.trim(),
        date_demenagement: formData.date
      };

      console.log('Submitting client information:', clientData);

      const response = await fetch('/api/demenagement/client-info/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData)
      });

      const result = await response.json();

      if (result.success) {
        console.log('Client information saved successfully:', result.data);
        setClientId(result.data.id);

        FormDataManager.markFormSubmitted(result.data.id, result.access_token);

        setAddressData((prev) => ({
          ...prev,
          departure: { ...prev.departure, address: formData.address.trim() },
        }));

        navigate("/tunnel/choix-volume");
      } else {
        console.error('Error saving client information:', result.message);
        alert('Erreur lors de l\'enregistrement de vos informations: ' + result.message);
      }
    } catch (error) {
      console.error('Error submitting client information:', error);
      alert('Erreur lors de l\'enregistrement de vos informations');
    }
  };

  const handleBackToForm = () => {
    navigate("/tunnel/mes-coordonnees");
  };

  const handleSelectMethod = (method: "list" | "photo" | "surface") => {
    setSelectedMethod(method);
    if (method === "list") {
      navigate("/tunnel/mon-volume/liste");
    } else if (method === "surface") {
      // Reset surface-method extra questions (default: nothing selected)
      setLogementType("");
      setAncienneteLogement("");
      navigate("/tunnel/mon-volume/surface");
    } else if (method === "photo") {
      navigate("/tunnel/mon-volume/ai");
    }
  };

  const handleContinueFromSurface = async () => {
    if (!ancienneteLogement) {
      alert("Veuillez sélectionner depuis quand vous êtes dans ce logement.");
      return;
    }

    try {
      // Calculate volume using the new formula: Volume (m³) = Surface (m²) ÷ 2
      const area = parseFloat(surfaceArea);
      const totalVolume = area / 2;

      console.log('Superficie calculation:', {
        area: area,
        totalVolume: totalVolume,
        formula: 'Surface ÷ 2'
      });

      // Prepare API payload for superficie method
      const payload = {
        client_info: clientId,
        method: "superficie",
        surface_area: area,
        logement_type: logementType || undefined,
        anciennete_logement: ancienneteLogement || undefined,
        calculated_volumes: {
          total_volume: totalVolume
        },
        heavy_objects: {},
        custom_heavy_objects: {},
        special_objects_selected: hasSpecialObjects,
        special_object_quantities: specialObjectQuantities
      };

      // Add heavy objects if selected
      if (hasSpecialObjects) {
        const heavyObjects: Record<string, number> = {};
        const customHeavyObjectsData: Record<string, any> = {};

        Object.entries(specialObjectQuantities).forEach(([object, quantity]) => {
          if (quantity > 0) {
            const isCustomHeavyObject = superficieCustomHeavyObjects.includes(object);

            if (isCustomHeavyObject) {
              const customHeavyDetails = superficieCustomHeavyObjectDetails[object];
              customHeavyObjectsData[object] = {
                name: object,
                quantity: quantity,
                length: customHeavyDetails?.length || 100,
                width: customHeavyDetails?.width || 50,
                height: customHeavyDetails?.height || 30
              };
            } else {
              heavyObjects[object] = quantity;
            }
          }
        });

        payload.heavy_objects = heavyObjects;
        payload.custom_heavy_objects = customHeavyObjectsData;
      }

      console.log('Submitting superficie calculation:', payload);

      // Call API to save superficie calculation
      const response = await apiFetch('/api/demenagement/superficie/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Superficie calculation result:', result);
      if (result.calculation_id != null) {
        setLastCalculationId(result.calculation_id);
        localStorage.setItem('lastCalculationId', result.calculation_id.toString());
      }
      setDeclaredVolumeM3(totalVolume);
      setDeclaredVolumeMethod('surface');
      localStorage.setItem('declaredVolumeM3', String(totalVolume));
      localStorage.setItem('declaredVolumeMethod', 'surface');

      // Navigate to next step
      navigate("/tunnel/adresses");

    } catch (error) {
      console.error('Error in superficie calculation:', error);
      alert('Erreur lors du calcul de la superficie. Veuillez réessayer.');
    }
  };

  const handleBackFromSurface = () => {
    navigate("/tunnel/choix-volume");
  };

  const handleBackToMethods = () => {
    navigate("/tunnel/choix-volume");
  };

  const _handlePreviousRoom = () => {
    const currentIndex = rooms.indexOf(selectedRoom || rooms[0]);
    if (currentIndex > 0) {
      setSelectedRoom(rooms[currentIndex - 1]);
    }
  };

  const _handleNextRoom = () => {
    const currentIndex = rooms.indexOf(selectedRoom || rooms[0]);
    if (currentIndex < rooms.length - 1) {
      setSelectedRoom(rooms[currentIndex + 1]);
    }
  };

  // AI Photo method functions
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, roomId: string) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Check for duplicates first
    try {
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('photos', file);
      });

      const response = await fetch('/api/check-duplicates/', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        if (result.duplicate_count > 0) {
          // Show warning about duplicates
          alert(`Attention: ${result.duplicate_count} image(s) déjà uploadée(s) ont été détectées et seront ignorées.`);
        }

        // Only add unique images
        const uniqueFiles = Array.from(files).filter(file =>
          result.unique_photos.some((unique: any) => unique.filename === file.name)
        );

        const newImages = uniqueFiles.map((file, index) => ({
          id: `${roomId}-${Date.now()}-${index}`,
          file,
          preview: URL.createObjectURL(file),
          roomId
        }));

        setUploadedImages(prev => [...prev, ...newImages]);
      }
    } catch (error) {
      console.error('Error checking duplicates:', error);
      // Fallback to original behavior if duplicate check fails
      const newImages = Array.from(files).map((file, index) => ({
        id: `${roomId}-${Date.now()}-${index}`,
        file,
        preview: URL.createObjectURL(file),
        roomId
      }));

      setUploadedImages(prev => [...prev, ...newImages]);
    }
  };

  const handleDeleteImage = (imageId: string) => {
    setUploadedImages(prev => prev.filter(image => image.id !== imageId));
  };

  const analyzeImages = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setAnalysisResults(null);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      // Analyze each uploaded image
      const allResults = [];
      for (const image of uploadedImages) {
        const formData = new FormData();
        formData.append('image', image.file);
        // Include custom rooms in the API call
        formData.append('custom_rooms', JSON.stringify(customRooms));
        // Include client_id to delete manual selections when AI method is chosen
        if (clientId) {
          formData.append('client_id', clientId.toString());
        }

        // Include heavy objects data
        const heavyObjectsData: Record<string, any> = {};
        for (const [key, value] of Object.entries(specialObjectQuantities)) {
          if (value > 0) {
            const isCustom = aiCustomHeavyObjects.includes(key);
            heavyObjectsData[key] = {
              quantity: value,
              is_custom: isCustom,
              ...(isCustom && aiCustomHeavyObjectDetails[key] ? aiCustomHeavyObjectDetails[key] : {})
            };
          }
        }
        if (Object.keys(heavyObjectsData).length > 0) {
          formData.append('heavy_objects', JSON.stringify(heavyObjectsData));
          console.log('Sending heavy objects:', heavyObjectsData);
        }

        const response = await fetch('/api/predict/', {
          method: 'POST',
          body: formData,
        });

        const results = await response.json();

        if (results.success) {
          allResults.push(results);
        } else {
          throw new Error(results.error || 'Analysis failed');
        }
      }

      // Combine results
      const combinedResults = combineAnalysisResults(allResults);
      setAnalysisResults(combinedResults);
      if (combinedResults.total_volume != null && combinedResults.total_volume > 0) {
        setDeclaredVolumeM3(combinedResults.total_volume);
        setDeclaredVolumeMethod('photo');
        localStorage.setItem('declaredVolumeM3', String(combinedResults.total_volume));
        localStorage.setItem('declaredVolumeMethod', 'photo');
      }
      setAnalysisProgress(100);

      clearInterval(progressInterval);

      // Navigate to AI results page after analysis is complete
      setTimeout(() => {
        navigate("/tunnel/ai-results");
      }, 1000);

    } catch (error) {
      console.error('Analysis error:', error);
      let errorMessage = 'Erreur lors de l\'analyse';

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      setAnalysisResults({
        success: false,
        error: errorMessage
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const combineAnalysisResults = (results: any[]) => {
    const roomResults: Record<string, Record<string, number>> = {};
    const combinedCounts: Record<string, number> = {};
    let totalObjects = 0;
    let allCustomRooms: string[] = [];
    const totalVolumeM3 = results.reduce((sum, r) => sum + (typeof r?.volume_calculation?.total_volume === 'number' ? r.volume_calculation.total_volume : 0), 0);

    // Organize results by room
    results.forEach((result, index) => {
      const roomId = uploadedImages[index]?.roomId || `Room ${index + 1}`;
      roomResults[roomId] = {};

      // Collect custom rooms from API response
      if (result.custom_rooms && Array.isArray(result.custom_rooms)) {
        allCustomRooms = [...allCustomRooms, ...result.custom_rooms];
      }

      if (result.object_counts) {
        Object.entries(result.object_counts).forEach(([object, count]) => {
          const objectCount = count as number;
          roomResults[roomId][object] = objectCount;
          combinedCounts[object] = (combinedCounts[object] || 0) + objectCount;
          totalObjects += objectCount;
        });
      }
    });

    // Update custom rooms state with unique custom rooms from API
    const uniqueCustomRooms = [...new Set([...customRooms, ...allCustomRooms])];
    if (uniqueCustomRooms.length !== customRooms.length) {
      setCustomRooms(uniqueCustomRooms);
    }

    setRoomAnalysisResults(roomResults);

    // Create summary
    const summaryParts: string[] = [];
    Object.entries(combinedCounts).forEach(([object, count]) => {
      if (count === 1) {
        summaryParts.push(`1 ${object}`);
      } else {
        summaryParts.push(`${count} ${object}s`);
      }
    });

    return {
      success: true,
      object_counts: combinedCounts,
      summary: summaryParts.length > 0 ? summaryParts.join(', ') : "Aucun objet détecté",
      total_objects: totalObjects,
      total_volume: totalVolumeM3 > 0 ? totalVolumeM3 : undefined,
      custom_rooms: uniqueCustomRooms,  // Include custom rooms in combined results
      individual_results: results
    };
  };

  const _handleContinueToAddresses = () => {
    navigate("/tunnel/adresses");
  };

  // API functions for manual selection method
  const submitManualSelection = async () => {
    // Check if client information is available
    if (!clientId) {
      alert('Veuillez d\'abord remplir vos informations personnelles');
      navigate("/tunnel/mes-coordonnees");
      return;
    }

    try {
      // Prepare room selections data
      const roomSelections: Record<string, Record<string, number>> = {};

      // Map room-specific quantities to API format
      Object.entries(roomObjectQuantities).forEach(([_roomName, objects]) => {
        if (Object.keys(objects).length > 0) {
          // Map frontend room names to backend room names
          const roomMapping: Record<string, string> = {
            "Entrée": "entree",
            "Salle de bain": "salle-de-bain",
            "Salon": "salon",
            "Cuisine": "cuisine",
            "Salle à manger": "salle-a-manger",
            "Chambre": "chambre",
            "Cave": "cave",
            "Jardin": "jardin",
            "Garage": "garage",
            "Autre": "autre"
          };

          const backendRoomName = roomMapping[_roomName] || "autre";

          Object.entries(objects).forEach(([item, quantity]) => {
            if (quantity > 0) {
              // Check if this is a predefined object (exists in ROOM_OBJECTS)
              const isPredefinedObject = Object.values(ROOM_OBJECTS).flat().includes(item);

              if (isPredefinedObject) {
                if (!roomSelections[backendRoomName]) {
                  roomSelections[backendRoomName] = {};
                }
                roomSelections[backendRoomName][item] = quantity;
              }
              // Custom objects will be handled separately in the custom_objects section
            }
          });
        }
      });

      // Prepare heavy objects data (predefined objects only)
      const heavyObjects: Record<string, number> = {};
      const customHeavyObjectsData: Record<string, any> = {};

      if (hasSpecialObjects) {
        Object.entries(specialObjectQuantities).forEach(([object, quantity]) => {
          if (quantity > 0) {
            // Check if this is a custom heavy object
            const isCustomHeavyObject = customHeavyObjects.includes(object);
            const isAiCustomHeavyObject = aiCustomHeavyObjects.includes(object);
            const isSuperficieCustomHeavyObject = superficieCustomHeavyObjects.includes(object);

            if (isCustomHeavyObject || isAiCustomHeavyObject || isSuperficieCustomHeavyObject) {
              // Handle custom heavy objects like custom objects
              // Use stored custom heavy object details if available, otherwise use defaults
              const customHeavyDetails = customHeavyObjectDetails[object] || aiCustomHeavyObjectDetails[object] || superficieCustomHeavyObjectDetails[object];
              customHeavyObjectsData[object] = {
                name: object,
                quantity: quantity,
                length: customHeavyDetails?.length || 100,
                width: customHeavyDetails?.width || 50,
                height: customHeavyDetails?.height || 30
              };
            } else {
              // Handle predefined heavy objects
              heavyObjects[object] = quantity;
            }
          }
        });
      }

      console.log('Heavy objects debug:', {
        hasSpecialObjects,
        specialObjectQuantities,
        heavyObjects,
        customHeavyObjectsData
      });

      // Prepare custom objects data from room-specific quantities
      const customObjects: Record<string, any> = {};
      Object.entries(roomObjectQuantities).forEach(([, objects]) => {
        Object.entries(objects).forEach(([item, quantity]) => {
          if (quantity > 0) {
            // Check if this is a custom object (not in predefined objects)
            const isCustomObject = !Object.values(ROOM_OBJECTS).flat().includes(item);
            if (isCustomObject) {
              // Use stored custom object details if available, otherwise use defaults
              const customDetails = customObjectDetails[item];
              customObjects[item] = {
                name: item,
                quantity: quantity,
                length: customDetails?.length || 100,
                width: customDetails?.width || 50,
                height: customDetails?.height || 30
              };
            }
          }
        });
      });

      // Create the API payload
      const payload = {
        client_info: clientId,
        room_selections: roomSelections,
        heavy_objects: heavyObjects,
        custom_objects: customObjects,
        custom_heavy_objects: customHeavyObjectsData
      };

      console.log('Submitting manual selection:', payload);

      const response = await apiFetch('/api/demenagement/rooms/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.success) {
        console.log('Manual selection submitted successfully:', result);
        // Store the selection/calculation ID for later use in quote calculation
        if (result.data?.selection_id != null) {
          setLastCalculationId(result.data.selection_id);
          // Persist in localStorage to survive navigation
          localStorage.setItem('lastCalculationId', result.data.selection_id.toString());
          console.log('Stored calculation ID:', result.data.selection_id);
        }
        if (result.data?.total_volume != null && typeof result.data.total_volume === 'number') {
          setDeclaredVolumeM3(result.data.total_volume);
          setDeclaredVolumeMethod('list');
          localStorage.setItem('declaredVolumeM3', String(result.data.total_volume));
          localStorage.setItem('declaredVolumeMethod', 'list');
        }
        // Navigate to addresses page
        navigate("/tunnel/adresses");
      } else {
        console.error('Error submitting manual selection:', result.message);
        alert('Erreur lors de l\'envoi de la sélection: ' + result.message);
      }
    } catch (error) {
      console.error('Error submitting manual selection:', error);
      alert('Erreur lors de l\'envoi de la sélection');
    }
  };

  const updateRoomObjectQuantity = (roomId: string, object: string, change: number) => {
    setRoomAnalysisResults(prev => {
      const currentObject = prev[roomId]?.[object];
      const currentQuantity = typeof currentObject === 'number' ? currentObject : (currentObject && typeof currentObject === 'object' && 'quantity' in currentObject ? currentObject.quantity : 0);
      const newQuantity = Math.max(0, currentQuantity + change);
      const isObjectVal = currentObject && typeof currentObject === 'object' && 'quantity' in currentObject;
      return {
        ...prev,
        [roomId]: {
          ...prev[roomId],
          [object]: isObjectVal && currentObject && typeof currentObject === 'object'
            ? { ...currentObject, quantity: newQuantity }
            : newQuantity
        }
      };
    });
  };

  const removeObjectFromRoom = (roomId: string, object: string) => {
    setRoomAnalysisResults(prev => {
      const newRoomResults = { ...prev[roomId] };
      delete newRoomResults[object];

      return {
        ...prev,
        [roomId]: newRoomResults
      };
    });
  };

  const addNewObjectToRoom = (roomId: string, objectName: string) => {
    setRoomAnalysisResults(prev => ({
      ...prev,
      [roomId]: {
        ...prev[roomId],
        [objectName]: {
          quantity: 1,
          volume_per_unit: 0.0,
          total_volume: 0.0,
          is_ai_detected: false,
          confidence: null
        }
      }
    }));
  };

  const handleBackToCleaning = () => {
    if (lastUsedMethod === "list") {
      navigate("/tunnel/mon-volume/liste");
    } else if (lastUsedMethod === "photo") {
      navigate("/tunnel/mon-volume/ai");
    } else if (lastUsedMethod === "surface") {
      navigate("/tunnel/mon-volume/surface");
    } else {
      // Fallback to method selection if no last method
      navigate("/tunnel/choix-volume");
    }
  };

  const handleContinueToQuote = async () => {
    const ok = await submitAddressData();
    if (!ok) return;
    navigate("/tunnel/devis");
  };

  // Submit address data to API
  const submitAddressData = async (): Promise<boolean> => {
    if (!addressData.departure.address?.trim()) {
      alert("Veuillez saisir l'adresse de départ.");
      return false;
    }
    if (!addressData.arrival.address?.trim()) {
      alert("Veuillez saisir l'adresse d'arrivée.");
      return false;
    }
    if (!clientId) {
      console.error('No client ID available');
      return false;
    }

    try {
      const addressPayload = {
        client_info: clientId,
        // Departure address
        adresse_depart: addressData.departure.address,
        etage_depart: addressData.departure.floor,
        ascenseur_depart: addressData.departure.elevator,
        demi_etage_depart: addressData.departure.demiEtage || false,
        options_depart: {
          monte_meuble: addressData.departure.options.monteMenuble || false,
          cave_ou_garage: addressData.departure.options.caveGarage || false,
          cours_a_traverser: addressData.departure.options.courTraverser || false,
        },
        // Stopover (escale)
        has_stopover: escales.length > 0,
        escale_adresse: escales.length > 0 ? escales[0].address : '',
        escale_etage: escales.length > 0 ? escales[0].floor : 'RDC',
        escale_ascenseur: escales.length > 0 ? escales[0].elevator : 'Non',
        demi_etage_escale: escales.length > 0 ? escales[0].demiEtage || false : false,
        escale_options: escales.length > 0 ? {
          monte_meuble: escales[0].options.monteMenuble || false,
          cave_ou_garage: escales[0].options.caveGarage || false,
          cours_a_traverser: escales[0].options.courTraverser || false,
        } : {},
        // Arrival address
        adresse_arrivee: addressData.arrival.address,
        etage_arrivee: addressData.arrival.floor,
        ascenseur_arrivee: addressData.arrival.elevator,
        demi_etage_arrivee: addressData.arrival.demiEtage || false,
        options_arrivee: {
          monte_meuble: addressData.arrival.options.monteMenuble || false,
          cave_ou_garage: addressData.arrival.options.caveGarage || false,
          cours_a_traverser: addressData.arrival.options.courTraverser || false,
        },
      };

      console.log('Submitting address data:', addressPayload);

      const response = await apiFetch('/api/demenagement/address/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addressPayload),
      });

      const result = await response.json();

      if (result.success) {
        console.log('Address data submitted successfully:', result);
        if (result.data?.id != null) {
          setLastAddressId(result.data.id);
          localStorage.setItem('lastAddressId', result.data.id.toString());
        }
        const origin = addressData.departure.address?.trim();
        const dest = addressData.arrival.address?.trim();
        if (origin && dest) {
          const dist = await getDistanceMatrix(origin, dest);
          if (dist.success) {
            setDistanceKm(dist.distanceKm);
            setDistanceText(dist.distanceText || `${dist.distanceKm} km`);
          }
        }
        return true;
      } else {
        console.error('Error submitting address data:', result);
        alert('Erreur lors de l\'enregistrement des adresses: ' + (result.message || 'Erreur inconnue'));
        return false;
      }
    } catch (error) {
      console.error('Error submitting address data:', error);
      alert('Erreur lors de l\'enregistrement des adresses');
      return false;
    }
  };

  const handleBackToAddresses = () => {
    navigate("/tunnel/adresses");
  };

  const _handleContinueToInfo = () => {
    navigate("/tunnel/info");
  };

  // Keep handlers for potential use (e.g. room navigation, steps)
  useEffect(() => {
    const _handlers = [_handlePreviousRoom, _handleNextRoom, _handleContinueToAddresses, _handleContinueToInfo, _dateOptions];
    void _handlers;
  }, []);

  // Fetch distance when on quote page and we have both addresses (e.g. direct navigation or refresh)
  useEffect(() => {
    const origin = addressData.departure.address?.trim();
    const dest = addressData.arrival.address?.trim();
    if (currentPage !== "quote" || !origin || !dest) return;
    let cancelled = false;
    if (distanceKm == null && !distanceText) setDistanceLoading(true);
    getDistanceMatrix(origin, dest).then((dist) => {
      if (cancelled) return;
      setDistanceLoading(false);
      if (dist.success) {
        setDistanceKm(dist.distanceKm);
        setDistanceText(dist.distanceText || `${dist.distanceKm} km`);
      }
    }).catch(() => {
      if (!cancelled) setDistanceLoading(false);
    });
    return () => { cancelled = true; };
  }, [currentPage, addressData.departure.address, addressData.arrival.address]);

  const handleBackToQuote = () => {
    navigate("/tunnel/devis");
  };

  const handleContinueToOptions = () => {
    navigate("/tunnel/options");
  };

  const handleBackToInfo = () => {
    navigate("/tunnel/info");
  };

  const handleSubmitOptions = async () => {
    setDevisSent(false);
    navigate("/tunnel/devis");
  };

  const handleSendDevis = async () => {
    // Validate personal info (now collected here at devis step)
    if (!formData.name.trim()) {
      alert('Le nom de famille est obligatoire');
      return;
    }
    if (!formData.firstName.trim()) {
      alert('Le prénom est obligatoire');
      return;
    }
    if (!formData.email.trim()) {
      alert('L\'adresse email est obligatoire');
      return;
    }
    if (!formData.phone.trim()) {
      alert('Le numéro de téléphone est obligatoire');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Veuillez entrer une adresse email valide');
      return;
    }
    const phoneClean = formData.phone.replace(/[\s\-\.\(\)]/g, '');
    if (!/^0[0-9]{9}$/.test(phoneClean)) {
      alert('Le numéro de téléphone doit être au format français (10 chiffres commençant par 0)');
      return;
    }

    // 1) Export the PDF for email (no auto-download here)
    if (!pdfReportRef.current) {
      alert("Erreur lors de la génération du PDF. L'email n'a pas été envoyé.");
      return;
    }

    let pdfBase64: string | null = null;
    let pdfFilename: string | null = null;

    try {
      const result = await pdfReportRef.current.exportPDF();
      if (!result) {
        alert("Erreur lors de la génération du PDF. L'email n'a pas été envoyé.");
        return;
      }
      const { blob, filename } = result;
      pdfFilename = filename;

      const dataUrl: string = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
      const parts = dataUrl.split(',');
      pdfBase64 = parts.length > 1 ? parts[1] : parts[0];
    } catch (err) {
      console.error("Error generating PDF before sending devis:", err);
      alert("Erreur lors de la génération du PDF. L'email n'a pas été envoyé.");
      return;
    }

    const resolvedClientId = clientId ?? (() => {
      const stored = localStorage.getItem('clientId');
      return stored ? Number.parseInt(stored) : null;
    })();

    if (!resolvedClientId) {
      alert('Erreur : informations client manquantes. Veuillez recommencer.');
      return;
    }

    setSendingDevis(true);
    setDevisSent(false);

    try {
      const declaredMethod = declaredVolumeMethod ?? lastUsedMethod ?? selectedMethod;
      const volumeMethodForEmail =
        declaredMethod === 'list'
          ? 'manual'
          : declaredMethod === 'photo'
            ? 'ai'
            : declaredMethod === 'surface'
              ? 'superficie'
              : undefined;

      const buildListMethodOutput = () => {
        const parts: string[] = [];
        Object.entries(roomObjectQuantities).forEach(([roomName, objects]) => {
          const items = Object.entries(objects)
            .filter(([, quantity]) => quantity > 0)
            .map(([objectName, quantity]) =>
              quantity === 1 ? objectName : `${objectName}×${quantity}`
            );
          if (items.length) {
            parts.push(`${roomName}: ${items.join(', ')}`);
          }
        });

        const heavyItems = Object.entries(specialObjectQuantities)
          .filter(([, quantity]) => quantity > 0)
          .map(([objectName, quantity]) =>
            quantity === 1 ? objectName : `${objectName}×${quantity}`
          );
        if (heavyItems.length) {
          parts.push(`Lourds: ${heavyItems.join(', ')}`);
        }

        return parts.length
          ? parts.join(' · ')
          : `Inventaire: ${declaredVolumeM3 != null && !Number.isNaN(declaredVolumeM3) ? `${declaredVolumeM3.toFixed(1)} m³` : ''}`;
      };

      const buildAiMethodOutput = () => {
        const parts: string[] = [];
        Object.entries(roomAnalysisResults).forEach(([roomName, objects]) => {
          const items: string[] = [];
          Object.entries(objects).forEach(([objectName, value]) => {
            const quantity =
              typeof value === 'number'
                ? value
                : typeof (value as any)?.quantity === 'number'
                  ? (value as any).quantity
                  : 0;

            if (quantity > 0) {
              items.push(quantity === 1 ? objectName : `${objectName}×${quantity}`);
            }
          });

          if (items.length) {
            parts.push(`${roomName}: ${items.join(', ')}`);
          }
        });

        const heavyItems = Object.entries(specialObjectQuantities)
          .filter(([, quantity]) => quantity > 0)
          .map(([objectName, quantity]) =>
            quantity === 1 ? objectName : `${objectName}×${quantity}`
          );
        if (heavyItems.length) {
          parts.push(`Lourds: ${heavyItems.join(', ')}`);
        }

        if (parts.length) return parts.join(' · ');
        if (analysisResults?.summary) return `Analyse IA: ${analysisResults.summary}`;
        return 'Analyse IA';
      };

      const buildSurfaceMethodOutput = () => {
        const area = surfaceArea ? Number(surfaceArea) : NaN;
        const areaLabel = !Number.isNaN(area) && area > 0 ? `${area.toFixed(0)} m²` : 'm²';
        const volumeLabel =
          declaredVolumeM3 != null && !Number.isNaN(declaredVolumeM3)
            ? `${Number(declaredVolumeM3).toFixed(1)} m³`
            : '—';
        return `Mon devis en fonction de la superficie : ${areaLabel} · Volume estimé : ${volumeLabel}`;
      };

      const methodOutputForEmail =
        declaredMethod === 'photo'
          ? buildAiMethodOutput()
          : declaredMethod === 'list'
            ? buildListMethodOutput()
            : declaredMethod === 'surface'
              ? buildSurfaceMethodOutput()
              : undefined;

      const storedCalcId = localStorage.getItem('lastCalculationId');

      const payload: Record<string, any> = {
        client_id: resolvedClientId,
        nom: formData.name.trim(),
        prenom: formData.firstName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.replace(/[\s\-\.\(\)]/g, ''),
        demontage_remontage: options.demontageRemontage,
        emballage_fragile: options.emballageFragile,
        emballage_cartons: options.emballageCartons,
        ...(volumeMethodForEmail ? { volume_method: volumeMethodForEmail } : {}),
        ...(methodOutputForEmail ? { method_output: methodOutputForEmail } : {}),
      };

      if (storedCalcId) {
        payload.calculation_id = Number.parseInt(storedCalcId);
      }
      if (declaredVolumeM3 != null && !Number.isNaN(declaredVolumeM3)) {
        payload.volume_m3 = declaredVolumeM3;
      }
      if (distanceKm != null) {
        payload.distance_km = distanceKm;
      }
      if (addressData.departure.options.portageDistanceM > 0) {
        payload.portage_depart_m = addressData.departure.options.portageDistanceM;
      }
      if (addressData.arrival.options.portageDistanceM > 0) {
        payload.portage_arrival_m = addressData.arrival.options.portageDistanceM;
      }

      if (pdfBase64 && pdfFilename) {
        payload.pdf_base64 = pdfBase64;
        payload.pdf_filename = pdfFilename;
      }

      const entryDisplay = getDevisEntryPageDisplay();
      payload.entry_page = entryDisplay;

      const response = await apiFetch('/api/quote/send-pdf/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Devis-Entry-Page': encodeURIComponent(entryDisplay),
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        setDevisSent(true);
        clearDevisEntryPage();
        navigate("/tunnel/devis/confirmation");
      } else {
        alert('Erreur lors de l\'envoi du devis : ' + (result.error || 'Erreur inconnue'));
      }
    } catch (error) {
      console.error('Error sending devis:', error);
      alert('Erreur lors de l\'envoi du devis. Veuillez réessayer.');
    } finally {
      setSendingDevis(false);
    }
  };

  const toggleOption = (optionKey: keyof typeof options) => {
    setOptions((prev) => {
      const newValue = !prev[optionKey];
      
      // Handle mutual exclusivity between emballageFragile and emballageCartons
      if (optionKey === "emballageFragile" && newValue) {
        return {
          ...prev,
          emballageFragile: true,
          emballageCartons: false,
        };
      } else if (optionKey === "emballageCartons" && newValue) {
        return {
          ...prev,
          emballageCartons: true,
          emballageFragile: false,
        };
      }
      
      return {
        ...prev,
        [optionKey]: newValue,
      };
    });
  };



  const updateAddressData = (
    section: "departure" | "arrival",
    field: string,
    value: any,
  ) => {
    setAddressData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const updateAddressOption = (
    section: "departure" | "arrival",
    option: string,
    value: boolean | number,
  ) => {
    setAddressData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        options: {
          ...prev[section].options,
          [option]: value,
        },
      },
    }));
  };

  const addEscale = () => {
    const newEscale = {
      id: Date.now(),
      address: "",
      floor: "RDC",
      elevator: "Non",
      demiEtage: false,
      options: {
        monteMenuble: false,
        caveGarage: false,
        courTraverser: false,
      },
    };
    setEscales((prev) => [...prev, newEscale]);
  };

  const removeEscale = (id: number) => {
    setEscales((prev) => prev.filter((escale) => escale.id !== id));
  };

  const updateEscaleData = (id: number, field: string, value: any) => {
    setEscales((prev) =>
      prev.map((escale) =>
        escale.id === id ? { ...escale, [field]: value } : escale
      )
    );
  };

  const updateEscaleOption = (id: number, option: string, value: boolean | number) => {
    setEscales((prev) =>
      prev.map((escale) =>
        escale.id === id
          ? {
            ...escale,
            options: {
              ...escale.options,
              [option]: value,
            },
          }
          : escale
      )
    );
  };

  const updateQuantity = (item: string, change: number) => {
    if (!selectedRoom) return;

    // Update room-specific quantities
    setRoomObjectQuantities((prev) => ({
      ...prev,
      [selectedRoom]: {
        ...prev[selectedRoom],
        [item]: Math.max(0, (prev[selectedRoom]?.[item] || 0) + change),
      },
    }));

    // Also update global quantities for backward compatibility
    setCleaningQuantities((prev) => ({
      ...prev,
      [item]: Math.max(0, (prev[item] || 0) + change),
    }));
  };

  // Function to delete custom objects
  const deleteCustomObject = (objectName: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${objectName}" ?`)) {
      setCleaningQuantities(prev => {
        const newQuantities = { ...prev };
        delete newQuantities[objectName];
        return newQuantities;
      });

      // Also remove from roomObjectQuantities for all rooms
      setRoomObjectQuantities(prev => {
        const newQuantities = { ...prev };
        Object.keys(newQuantities).forEach(room => {
          if (newQuantities[room] && newQuantities[room][objectName]) {
            delete newQuantities[room][objectName];
          }
        });
        return newQuantities;
      });

      // Also remove from custom object details
      setCustomObjectDetails(prev => {
        const newDetails = { ...prev };
        delete newDetails[objectName];
        return newDetails;
      });
    }
  };

  // Function to check if an object is custom (not in predefined objects)
  const isCustomObject = (objectName: string) => {
    return !Object.values(ROOM_OBJECTS).flat().includes(objectName);
  };

  const rooms = [
    "Entrée",
    "Salon",
    "Cuisine",
    "Salle à manger",
    "Chambre",
    "Salle de bain",
    "Cave",
    "Jardin",
    "Garage",
    "Autre"
  ];


  const BoxIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none">
      <g clipPath="url(#clip0_4418_9499)">
        <path d="M3.17004 7.43945L12 12.5494L20.77 7.46942" stroke="#cc922f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 21.6091V12.5391" stroke="#cc922f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9.92999 2.48L4.59 5.45003C3.38 6.12003 2.39001 7.80001 2.39001 9.18001V14.83C2.39001 16.21 3.38 17.89 4.59 18.56L9.92999 21.53C11.07 22.16 12.94 22.16 14.08 21.53L19.42 18.56C20.63 17.89 21.62 16.21 21.62 14.83V9.18001C21.62 7.80001 20.63 6.12003 19.42 5.45003L14.08 2.48C12.93 1.84 11.07 1.84 9.92999 2.48Z" stroke="#cc922f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17 13.2396V9.57965L7.51001 4.09961" stroke="#cc922f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs>
        <clipPath id="clip0_4418_9499">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );

  const BancIcon = () => (
    <img
      src="/sofa.svg"
      alt="Banc"
      className="w-12 h-12"
      loading="lazy"
      decoding="async"
    />
  );

  const CadreIcon = () => (
    <svg
      className="w-12 h-12"
      viewBox="0 -1.5 167 167"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="#CC922F"
      strokeWidth="7.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g clipPath="url(#clip0)">
        <path
          d="M1.52881 142.436C-0.633821 152.478 3.31671 159.102 12.9551 161.6C15.0217 162.127 17.147 162.387 19.2795 162.374C21.3996 162.362 23.5141 162.157 25.5974 161.764C29.7421 161.01 33.0389 158.76 35.7358 156.569C46.0777 164.446 56.8798 161.725 65.2357 158.342C69.309 160.945 74.0536 162.301 78.8876 162.242C83.6834 162.16 87.9942 160.324 92.0543 156.633C100.455 161.354 108.869 161.518 117.075 157.116C125.515 161.312 132.625 161.382 139.39 157.342C143.818 159.887 147.743 160.643 151.713 159.716C160.07 157.769 165.89 148.217 164.167 139.273C163.31 134.949 161.339 130.924 158.449 127.595C164.019 124.379 166.672 119.994 166.557 114.218C166.447 108.705 164.244 104.033 159.825 99.9551L160.045 99.7253C160.468 99.2836 160.829 98.9062 161.184 98.5242C166.596 92.7045 166.735 85.0929 161.538 79.1314C161.21 78.7514 160.869 78.3779 160.515 77.9881L160.422 77.8857C163.225 75.0234 165.743 71.6925 165.923 66.9655C166.098 62.3713 164.318 58.7872 160.487 56.022C163.857 52.1372 165.35 48.4801 165.308 44.25C165.327 42.1052 164.887 39.9809 164.02 38.0195C163.151 36.0582 161.874 34.3051 160.273 32.8775C166.841 24.5866 166.529 15.4925 159.365 7.20756C151.991 -1.32024 139.867 -1.85315 129.744 5.84569C122.299 1.23492 114.829 1.27886 107.528 5.97693C104.463 3.54454 100.889 3.00958 97.773 2.81333C92.8315 2.50091 88.5843 3.88904 85.1477 6.93708C76.2418 0.741246 69.1226 0.671042 60.0316 6.6831C52.464 0.501706 43.8955 0.376992 36.3679 6.32801C32.3978 2.10513 27.8781 0.333062 22.5723 0.92508C16.3122 1.61817 11.5295 3.70524 7.95049 7.30726C4.63661 10.6428 2.76862 15.2352 2.54809 20.5889C2.31509 26.2551 2.49761 31.6718 7.06835 35.6506C3.55953 39.1965 1.49593 43.9213 1.2794 48.9052C0.974861 54.2386 3.8234 58.0015 7.38009 61.9435C4.54352 65.7289 2.82274 70.2328 2.41229 74.9446C1.94038 80.4664 4.8322 84.2811 8.1487 87.5463C2.93276 95.0096 2.8284 102.446 7.8376 109.66C2.19832 117.668 2.03483 123.725 7.25535 131.664C4.37074 134.276 2.54548 137.718 1.52881 142.436ZM12.9918 31.802C8.73212 26.6353 10.2548 21.2046 12.5323 16.1048C14.3156 12.1143 17.8697 10.3198 24.0556 10.2864H24.082C25.5541 10.408 26.992 10.7949 28.3264 11.4284C28.7373 11.5912 29.1449 11.7526 29.5498 11.901C30.0234 12.0996 30.4738 12.3496 30.8927 12.6466C31.3888 12.9957 31.9222 13.2888 32.483 13.5202C36.7827 15.1269 37.1634 15.1899 39.4718 12.7326C39.6772 12.5141 39.9036 12.2731 40.1569 12.0106C43.9985 8.02792 50.2756 7.97803 54.7591 11.8924C55.7797 12.7837 56.8312 13.6292 57.9437 14.5238C58.4727 14.9497 59.0149 15.3855 59.5747 15.843C59.7081 15.9514 59.8776 16.0049 60.049 15.9926C60.2204 15.9804 60.3809 15.9034 60.4976 15.7773C69.3923 6.12912 78.1984 9.72586 86.3901 15.0514C86.4676 15.1024 86.5555 15.1366 86.6474 15.152C86.7393 15.1674 86.8332 15.1635 86.9231 15.1406C87.0137 15.1178 87.0977 15.0765 87.1712 15.0194C87.2447 14.9622 87.3051 14.8905 87.3497 14.8087C89.3614 11.1063 92.6831 9.61356 98.1196 9.99424C99.2216 10.0963 100.315 10.2717 101.394 10.5194C101.933 10.6296 102.472 10.7392 103.013 10.8331C103.563 10.8611 104.095 11.0465 104.544 11.367C104.993 11.6876 105.341 12.13 105.546 12.642C106.263 14.2133 107.157 14.6216 107.782 14.6878C108.385 14.7463 109.307 14.5565 110.266 13.2668C112.141 10.7445 114.819 9.61566 118.95 9.60647H118.99C120.789 9.65235 122.583 9.82773 124.357 10.1314C125.002 10.2253 125.648 10.3192 126.297 10.4025C126.305 10.5857 126.312 10.761 126.318 10.9277C126.32 11.586 126.384 12.2427 126.507 12.8895C126.57 13.3273 126.74 13.7425 127.004 14.0977C127.268 14.4529 127.615 14.7368 128.016 14.924C128.445 15.0623 128.902 15.0922 129.345 15.0109C129.789 14.9296 130.205 14.7396 130.557 14.4581C130.992 14.1443 131.397 13.7913 131.767 13.4033C131.964 13.2064 132.161 13.0095 132.369 12.831C134.916 10.6069 138.024 9.12157 141.355 8.53526C142.939 8.23808 144.567 8.26932 146.14 8.62709C147.712 8.98486 149.193 9.66154 150.493 10.6152C151.891 11.6497 153.066 12.9564 153.945 14.4566C154.825 15.9567 155.392 17.6194 155.613 19.3445C156.251 24.166 153.752 27.7127 150.957 30.8264C149.603 32.336 149.093 33.5616 149.35 34.6891C149.598 35.7806 150.571 36.6627 152.325 37.3866C155.004 38.4945 156.776 40.2632 157.313 42.3688C157.855 44.4979 157.129 46.9358 155.268 49.2356C154.549 50.1681 153.714 51.0047 152.783 51.7251C150.146 53.6718 149.586 55.991 151.071 58.8191C151.15 58.9737 151.287 59.0913 151.452 59.1473C151.809 59.2681 152.182 59.3818 152.562 59.4973C153.392 59.7276 154.203 60.0185 154.991 60.3671C156.904 61.2741 158.165 62.5848 158.637 64.1567C159.116 65.7543 158.772 67.5805 157.642 69.4399C156.121 72.108 153.748 74.1885 150.904 75.347C150.787 75.3936 150.687 75.471 150.613 75.5714C150.539 75.6719 150.493 75.7907 150.483 75.9154L150.115 80.198C150.104 80.3227 150.128 80.448 150.184 80.5596C150.241 80.6712 150.327 80.7651 150.434 80.8307C150.592 80.9272 150.732 81.0276 150.863 81.1201C151.162 81.3617 151.504 81.5441 151.871 81.659C153.034 81.9031 154.119 82.4295 155.03 83.1915C155.942 83.9542 156.651 84.9295 157.097 86.0315C157.465 87.1296 157.558 88.3024 157.366 89.4451C157.174 90.5878 156.704 91.6662 155.997 92.5837C155.688 93.0202 155.372 93.4514 155.055 93.8826C153.432 96.0951 151.754 98.3825 150.926 101.519C150.892 101.648 150.896 101.784 150.94 101.909C150.982 102.035 151.061 102.145 151.167 102.226C151.395 102.402 151.626 102.59 151.868 102.783C152.432 103.235 153.013 103.701 153.653 104.123C156.946 106.294 158.75 109.566 158.603 113.103C158.456 116.64 156.389 119.744 152.931 121.632C152.304 121.974 151.664 122.292 151.024 122.611C150.271 122.985 149.493 123.372 148.741 123.796C147.443 124.529 146.728 125.521 146.727 126.591C146.727 127.635 147.416 128.602 148.667 129.31C152.56 131.512 154.655 135.17 155.26 140.82C155.437 142.112 155.311 143.428 154.891 144.663C154.472 145.897 153.77 147.017 152.842 147.934C151.839 148.858 150.636 149.54 149.328 149.926C148.019 150.313 146.639 150.393 145.294 150.162C143.862 149.954 142.407 149.821 140.993 149.694C140.188 149.62 139.383 149.547 138.579 149.46C136.151 149.197 135.873 151.059 135.692 152.289V152.296C131.838 153.538 127.714 153.685 123.782 152.719C121.901 152.246 120.276 151.837 119.399 150C119.242 149.631 119 149.306 118.692 149.052C118.383 148.798 118.018 148.622 117.627 148.538C117.187 148.477 116.739 148.522 116.319 148.668C115.9 148.814 115.52 149.056 115.213 149.377C112.654 151.8 109.323 152.311 106.707 152.484C104.066 152.586 101.421 152.452 98.8041 152.081C97.9496 152.016 97.1239 151.744 96.3986 151.287C95.674 150.83 95.0715 150.203 94.6449 149.46C94.1783 148.789 93.579 148.22 92.8833 147.79C92.626 147.606 92.37 147.423 92.1384 147.228C92.0077 147.118 91.8404 147.062 91.6697 147.07C91.4991 147.079 91.3376 147.152 91.2195 147.275C85.0282 153.679 78.8199 155.418 71.6816 152.742C70.2987 152.192 69.0116 151.424 67.8709 150.468C66.1216 149.053 64.9246 148.587 63.8672 148.914C62.8098 149.241 62.0714 150.307 61.417 152.474C61.3779 152.565 61.331 152.653 61.2766 152.736L61.2207 152.83C56.6454 154.077 51.761 155.186 46.6738 154.243C42.7567 153.521 39.1514 152.499 38.0757 148.059C37.914 147.619 37.5872 147.259 37.1647 147.056C37.0049 146.955 36.8504 146.845 36.702 146.728C36.5816 146.63 36.4312 146.576 36.276 146.576C36.1684 146.576 36.0623 146.602 35.9669 146.652C35.2641 147.014 34.5599 147.375 33.8541 147.733C32.3012 148.525 30.6958 149.344 29.1324 150.185C24.5136 152.752 19.0834 153.439 13.971 152.104C10.4452 151.22 9.2585 149.675 9.27097 145.993C9.31757 144.567 9.4791 143.147 9.75404 141.747L9.86109 141.104C10.4295 137.646 12.3335 135.501 15.6828 134.546C16.003 134.444 16.3123 134.31 16.6062 134.147L16.7053 134.096C16.8735 134.001 17.0158 133.865 17.1195 133.702C17.172 133.632 17.2422 133.539 17.3459 133.412C17.4408 133.295 17.494 133.15 17.4972 133C17.5005 132.849 17.4534 132.702 17.3636 132.581C16.9928 132.085 16.5964 131.592 16.1966 131.095C15.2721 130.015 14.4484 128.853 13.736 127.622C12.8172 125.903 11.8577 123.881 11.7382 121.921C11.6689 119.792 12.0857 117.674 12.957 115.729C13.5727 114.486 14.3613 113.337 15.2994 112.316C15.7116 111.818 16.1382 111.304 16.5294 110.776C16.613 110.664 16.6595 110.529 16.6626 110.389C16.6656 110.249 16.625 110.112 16.5465 109.996C10.476 101.043 10.7445 92.9966 17.2842 87.9145C17.411 87.8154 17.4984 87.675 17.5307 87.5174C17.5629 87.3599 17.5379 87.1959 17.4602 87.0547C17.3611 86.8756 17.2632 86.6892 17.1674 86.5001C16.9367 86.0295 16.6747 85.574 16.383 85.1382C15.8685 84.4018 15.3329 83.6798 14.7947 82.9572C13.8811 81.7266 12.9366 80.4533 12.1326 79.1419C10.0947 75.8156 10.8364 68.3878 13.4782 65.671C14.0301 65.2082 14.6617 64.8497 15.3421 64.6134C15.7635 64.4303 16.2406 64.2236 16.7303 63.9702C16.8156 63.9262 16.8906 63.8645 16.9502 63.7891C17.0097 63.7138 17.0525 63.6266 17.0757 63.5334C17.0988 63.4402 17.1017 63.343 17.0842 63.2485C17.0668 63.1541 17.0293 63.0645 16.9744 62.9857C16.4093 62.1692 15.8645 61.3666 15.329 60.5764C14.1712 58.8699 13.0777 57.2586 11.8957 55.6788C7.29543 49.5296 7.55005 44.0399 12.6971 38.4006C13.5743 37.5441 14.093 36.386 14.1477 35.1612C14.2024 33.9363 13.7891 32.7365 12.9918 31.8051V31.802Z"
          fill="none"
        />
        <path
          d="M27.7581 130.806C28.3665 132.986 30.0283 134.201 32.439 134.228C33.498 134.241 34.5564 134.257 35.6144 134.276C37.5027 134.308 39.4356 134.341 41.3679 134.341C42.2124 134.341 43.0558 134.334 43.898 134.32C52.8899 134.159 62.0241 133.959 70.8602 133.766L81.2894 133.539C81.4075 133.537 81.5224 133.504 81.6235 133.443C81.7239 133.382 81.8073 133.296 81.8644 133.193C84.0959 133.193 86.3294 133.199 88.5649 133.209C94.0191 133.227 99.657 133.245 105.204 133.17C114.903 133.038 122.828 132.811 130.145 132.458C131.05 132.415 134.156 132.137 136.104 130.403C137.648 129.058 138.869 127.383 139.68 125.504C140.49 123.624 140.867 121.585 140.784 119.54C140.703 113.935 140.738 108.231 140.772 102.715C140.8 98.0773 140.83 93.2814 140.79 88.5623C140.74 82.5897 140.524 76.1917 140.126 69.0087C139.885 64.6515 139.839 60.2033 139.798 55.903C139.715 47.83 139.629 39.4808 138.255 31.3009C137.624 27.5492 136.947 26.583 133.056 26.417C132.553 26.396 132.053 26.4071 131.57 26.417C131.271 26.4242 130.971 26.4347 130.672 26.4301C127.285 26.4192 123.899 26.4056 120.513 26.3894C113.571 26.3586 106.397 26.3239 99.3315 26.333C79.1616 26.3481 58.1137 26.3914 34.9811 26.4642C31.5681 26.4754 29.4415 28.214 28.6546 31.6322C28.3233 33.0947 28.1273 34.5847 28.0692 36.0831C27.9816 38.1427 27.8942 40.2024 27.8066 42.2625C27.4994 49.2853 27.1825 56.5462 27.0427 63.6964C26.7998 76.1418 26.746 88.7953 26.6935 101.098C26.6607 108.873 26.7132 116.808 26.8556 125.357C26.921 127.204 27.2244 129.036 27.7581 130.806ZM131.088 79.9472C131.163 94.2022 131.239 108.936 130.425 123.495L36.5582 126.914L35.833 33.5888L131.606 34.9172C131.621 34.988 131.635 35.057 131.65 35.1239C131.732 35.4308 131.776 35.7468 131.781 36.0645C130.936 50.6785 131.014 65.5579 131.088 79.9472Z"
          fill="none"
        />
      </g>
      <defs>
        <clipPath id="clip0">
          <rect width="166.053" height="162.772" fill="white" transform="translate(0.896484 0.23584)" />
        </clipPath>
      </defs>
    </svg>
  );

  const CartonIcon = () => (
    <svg
      
      viewBox="0 0 24 24"
      width="48px" height="48px"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="#CC922F"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.4856 1.12584C12.1836 0.958052 11.8164 0.958052 11.5144 1.12584L2.51436 6.12584L2.5073 6.13784L2.49287 6.13802C2.18749 6.3177 2 6.64568 2 7V16.9999C2 17.3631 2.19689 17.6977 2.51436 17.874L11.5022 22.8673C11.8059 23.0416 12.1791 23.0445 12.4856 22.8742L21.4856 17.8742C21.8031 17.6978 22 17.3632 22 17V7C22 6.64568 21.8125 6.31781 21.5071 6.13813C21.4996 6.13372 21.4921 6.12942 21.4845 6.12522L12.4856 1.12584ZM5.05923 6.99995L12.0001 10.856L14.4855 9.47519L7.74296 5.50898L5.05923 6.99995ZM16.5142 8.34816L18.9409 7L12 3.14396L9.77162 4.38195L16.5142 8.34816ZM4 16.4115V8.69951L11 12.5884V20.3004L4 16.4115ZM13 20.3005V12.5884L20 8.69951V16.4116L13 20.3005Z"
      />
    </svg>
  );

  /** Console (meuble) — Entrée, sélection manuelle */
  const ConsoleIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 496 496"
      fill="#CC922F"
      stroke="#CC922F"
      strokeWidth={0}
      className="w-12 h-12 shrink-0"
      aria-hidden
    >
      <path d="M112,432c-8.832,0-16,7.152-16,16v32c0,8.848,7.168,16,16,16c8.832,0,16-7.152,16-16v-32C128,439.152,120.832,432,112,432 z" />
      <path d="M384,432c-8.832,0-16,7.152-16,16v32c0,8.848,7.168,16,16,16c8.832,0,16-7.152,16-16v-32C400,439.152,392.832,432,384,432 z" />
      <path d="M378.992,192H117.456C98.784,192,64,192,64,236.688V448c0,8.848,7.168,16,16,16h336c8.832,0,16-7.152,16-16V236.688 C432,192,397.52,192,378.992,192z M400,432H96V236.688C96,224.72,96,224,117.456,224h261.536C400,224,400,224.464,400,236.688V432 z" />
      <path d="M240,192c-8.832,0-16,7.152-16,16v240c0,8.848,7.168,16,16,16c8.832,0,16-7.152,16-16V208 C256,199.152,248.832,192,240,192z" />
      <path d="M256,320h-32c-8.832,0-16,7.152-16,16c0,8.848,7.168,16,16,16h32c8.832,0,16-7.152,16-16C272,327.152,264.832,320,256,320 z" />
      <path d="M240,112c-8.832,0-16,7.152-16,16v80c0,8.848,7.168,16,16,16c8.832,0,16-7.152,16-16v-80C256,119.152,248.832,112,240,112 z" />
      <path d="M368,0H112c-8.832,0-16,7.152-16,16v192c0,8.848,7.168,16,16,16h256c8.832,0,16-7.152,16-16V16C384,7.152,376.832,0,368,0 z M352,192H128V32h224V192z" />
      <path d="M207.072,32.432c-6.256-6.24-16.368-6.256-22.624-0.016l-26.16,26.128c-6.256,6.256-6.256,16.384-0.016,22.64 c3.136,3.12,7.232,4.688,11.328,4.688c4.096,0,8.176-1.552,11.296-4.672l26.16-26.128 C213.312,48.816,213.312,38.688,207.072,32.432z" />
      <path d="M237.104,59.312c-6.256-6.256-16.384-6.256-22.624,0l-49.264,49.28c-6.256,6.256-6.256,16.368,0,22.624 c3.12,3.12,7.216,4.688,11.312,4.688s8.192-1.568,11.312-4.688l49.264-49.28C243.36,75.68,243.36,65.568,237.104,59.312z" />
      <path d="M300.128,46.768c-6.272-6.24-16.384-6.256-22.624,0.032l-8.576,8.592c-6.256,6.256-6.24,16.368,0.016,22.624 c3.136,3.104,7.216,4.672,11.312,4.672c4.096,0,8.192-1.568,11.312-4.704l8.576-8.592C306.4,63.136,306.384,53.024,300.128,46.768 z" />
    </svg>
  );

  /** Étagère murale (libellé liste : Etagére muale) — Entrée, sélection manuelle */
  const EtagereMuraleIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill="#CC922F"
      stroke="#CC922F"
      strokeWidth={0}
      className="w-12 h-12 shrink-0"
      aria-hidden
    >
      <path d="M112,464c-8.848,0-16,7.168-16,16v16c0,8.832,7.152,16,16,16s16-7.168,16-16v-16C128,471.168,120.848,464,112,464z" />
      <path d="M400,464c-8.848,0-16,7.168-16,16v16c0,8.832,7.152,16,16,16c8.848,0,16-7.168,16-16v-16C416,471.168,408.848,464,400,464 z" />
      <path d="M432,0H123.376C91.184,0,64,27.296,64,59.616V480c0,8.832,7.152,16,16,16h352c8.848,0,16-7.168,16-16V16 C448,7.168,440.848,0,432,0z M416,464H96V59.616C96,44.896,108.8,32,123.376,32H416V464z" />
      <path d="M256,0c-8.848,0-16,7.168-16,16v464c0,8.832,7.152,16,16,16c8.848,0,16-7.168,16-16V16C272,7.168,264.848,0,256,0z" />
      <path d="M128,224c-8.848,0-16,7.168-16,16v48c0,8.832,7.152,16,16,16s16-7.168,16-16v-48C144,231.168,136.848,224,128,224z" />
      <path d="M368,64H256c-8.848,0-16,7.168-16,16c0,8.832,7.152,16,16,16h112c8.848,0,16-7.168,16-16C384,71.168,376.848,64,368,64z" />
      <path d="M368,128H256c-8.848,0-16,7.168-16,16c0,8.832,7.152,16,16,16h112c8.848,0,16-7.168,16-16 C384,135.168,376.848,128,368,128z" />
      <path d="M368,192H256c-8.848,0-16,7.168-16,16c0,8.832,7.152,16,16,16h112c8.848,0,16-7.168,16-16 C384,199.168,376.848,192,368,192z" />
      <path d="M368,272H256c-8.848,0-16,7.168-16,16c0,8.832,7.152,16,16,16h112c8.848,0,16-7.168,16-16 C384,279.168,376.848,272,368,272z" />
      <path d="M368,336H256c-8.848,0-16,7.168-16,16c0,8.832,7.152,16,16,16h112c8.848,0,16-7.168,16-16 C384,343.168,376.848,336,368,336z" />
      <path d="M368,400H256c-8.848,0-16,7.168-16,16c0,8.832,7.152,16,16,16h112c8.848,0,16-7.168,16-16 C384,407.168,376.848,400,368,400z" />
    </svg>
  );

  /** Meuble à chaussures — trait fin comme les autres icônes Entrée */
  const MeubleChaussureIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className="w-12 h-12 shrink-0"
      aria-hidden
    >
      <rect
        x="5.75"
        y="3.75"
        width="12.5"
        height="16.5"
        rx="1.25"
        stroke="#CC922F"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <path
        d="M8.25 9.25h7.5M8.25 14.25h7.5M8.25 19.25h7.5"
        stroke="#CC922F"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <path
        d="M9 21.25v-1M15 21.25v-1"
        stroke="#CC922F"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </svg>
  );

  const MiroirIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 31.342 31.342"
      fill="#CC922F"
      stroke="#CC922F"
      strokeWidth={0}
      className="w-12 h-12 shrink-0"
      aria-hidden
    >
      <path d="M19.438,6.188l0.719,0.295l-7.687,18.673l-0.718-0.295L19.438,6.188z M17.017,6.935L16.299,6.64l-3.541,8.603l0.718,0.295 L17.017,6.935z M14.477,24.021l0.718,0.295l3.54-8.604l-0.718-0.295L14.477,24.021z M26.146,21.25 c-0.288,0.773-1.06,1.223-1.845,1.141c0.604,0.426,0.904,1.197,0.688,1.945c-0.254,0.873-1.12,1.395-1.995,1.25 c0.5,0.707,0.429,1.689-0.217,2.307c-0.609,0.584-1.526,0.646-2.203,0.201c0,0,0,0-0.001,0c0.386,0.842,0.068,1.848-0.755,2.299 c-0.798,0.437-1.777,0.191-2.293-0.529c-0.146,0.854-0.893,1.498-1.786,1.478c-0.905-0.021-1.628-0.715-1.72-1.592 c-0.046-0.013-0.092-0.022-0.137-0.037c-0.53,0.709-1.514,0.933-2.302,0.479c-0.722-0.414-1.039-1.258-0.82-2.024 c-0.724,0.369-1.628,0.207-2.17-0.442c-0.542-0.65-0.539-1.57-0.048-2.216c-0.869,0.211-1.784-0.239-2.119-1.098 c-0.294-0.752-0.044-1.58,0.553-2.063c-0.753-0.029-1.436-0.529-1.646-1.296c-0.211-0.766,0.117-1.547,0.75-1.957 c-0.715-0.176-1.276-0.778-1.352-1.551c-0.083-0.873,0.479-1.655,1.297-1.881c-0.815-0.225-1.378-1.004-1.295-1.876 c0.087-0.912,0.847-1.588,1.741-1.603c-0.821-0.303-1.316-1.167-1.121-2.045c0.199-0.89,1.032-1.467,1.917-1.375 C6.48,8.29,6.161,7.294,6.566,6.45c0.425-0.886,1.479-1.263,2.367-0.858c0.002-0.003,0.004-0.007,0.006-0.009 C8.342,4.924,8.293,3.913,8.87,3.202c0.577-0.71,1.571-0.87,2.338-0.426c-0.256-0.802,0.085-1.698,0.856-2.108 c0.773-0.412,1.71-0.192,2.232,0.475C14.552,0.476,15.195,0,15.952,0c0.88,0,1.604,0.64,1.749,1.479 c0.021,0.006,0.04,0.011,0.061,0.017c0.548-0.625,1.478-0.799,2.226-0.368c0.752,0.433,1.064,1.331,0.791,2.122 c0.622-0.33,1.405-0.272,1.978,0.208c0.695,0.585,0.821,1.586,0.337,2.329c0.85-0.173,1.719,0.29,2.023,1.129 c0.27,0.748,0.004,1.553-0.597,2.013c0.691,0.012,1.342,0.429,1.617,1.11c0.341,0.843-0.017,1.787-0.792,2.217 c0.831,0.243,1.384,1.06,1.262,1.944c-0.098,0.695-0.586,1.234-1.211,1.439c0,0.02-0.001,0.039-0.001,0.059 c0.609,0.2,1.092,0.715,1.204,1.391c0.148,0.896-0.404,1.74-1.256,1.99C26.102,19.5,26.463,20.416,26.146,21.25z M8.736,25.3 c-0.016-0.026-0.033-0.054-0.049-0.082c0.012,0.031,0.024,0.062,0.037,0.095C8.728,25.311,8.732,25.305,8.736,25.3z M23.845,15.602 c0-7.088-3.603-12.854-8.029-12.854c-4.427,0-8.03,5.767-8.03,12.854c0,7.087,3.603,12.854,8.03,12.854 C20.242,28.457,23.845,22.689,23.845,15.602z" />
    </svg>
  );

  const PorteManteauIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 511.104 511.104"
      fill="#CC922F"
      stroke="#CC922F"
      strokeWidth={0}
      className="w-12 h-12 shrink-0"
      aria-hidden
    >
      <path d="M321.656,464.416H188.984c-30.768,0-37.232,16.112-37.232,29.616c0,8.832,7.168,15.76,16.016,15.76 c7.776,0,14.272-5.744,15.712-13.152c1.216-0.112,2.992-0.208,5.504-0.208h132.672c2.768,0,4.624,0.192,5.808,0.384 c0.848,8.032,7.648,14.288,15.904,14.288c8.832,0,16-7.168,15.984-16.016C359.352,485.872,355.688,464.416,321.656,464.416z" />
      <path d="M255.32,32.432c-8.832,0-16,7.168-16,16v432c0,8.832,7.168,16,16,16c8.832,0,16-7.168,16-16v-432 C271.32,39.6,264.152,32.432,255.32,32.432z" />
      <path d="M253.848,0c-14.336,0-26,11.664-26,26s11.664,26,26,26c14.336,0,26-11.664,26-26S268.184,0,253.848,0z M253.848,32 c-3.312,0-6-2.688-6-6s2.688-6,6-6c3.296,0,6,2.688,6,6S257.16,32,253.848,32z" />
      <path d="M246.36,156.896c-33.472-3.76-58.72-32.032-58.72-65.776c0-8.832-7.168-16-16-16c-8.832,0-16,7.168-16,16 c0,50.064,37.488,92.016,87.168,97.568c0.608,0.064,1.2,0.096,1.808,0.096c8.032,0,14.96-6.032,15.856-14.208 C261.464,165.792,255.144,157.872,246.36,156.896z" />
      <path d="M336.04,75.104c-8.832,0-16,7.168-16,16c0,33.76-25.248,62.032-58.736,65.776c-8.784,0.976-15.104,8.896-14.112,17.68 c0.912,8.176,7.84,14.224,15.872,14.224c0.592,0,1.2-0.016,1.808-0.112c49.696-5.552,87.168-47.504,87.168-97.568 C352.04,82.272,344.872,75.104,336.04,75.104z" />
      <path d="M246.36,281.248c-33.472-3.76-58.72-32.032-58.72-65.792c0-8.832-7.168-16-16-16c-8.832,0-16,7.168-16,16 c0,50.064,37.488,92.032,87.168,97.584c0.608,0.064,1.2,0.096,1.808,0.096c8.032,0,14.96-6.048,15.856-14.208 C261.464,290.144,255.144,282.224,246.36,281.248z" />
      <path d="M336.04,199.44c-8.832,0-16,7.168-16,16c0,33.76-25.248,62.048-58.736,65.792c-8.784,0.976-15.104,8.896-14.112,17.68 c0.912,8.176,7.84,14.224,15.872,14.224c0.592,0,1.2-0.032,1.808-0.112c49.696-5.552,87.168-47.504,87.168-97.584 C352.04,206.608,344.872,199.44,336.04,199.44z" />
    </svg>
  );

  /** Coffre / banc à chaussures — trait fin comme les autres icônes Entrée */
  const CoffreChaussuresIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className="w-12 h-12 shrink-0"
      aria-hidden
    >
      <path
        d="M4.75 9.25h14.5c.69 0 1.25.56 1.25 1.25v9.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-9.5c0-.69.56-1.25 1.25-1.25z"
        stroke="#CC922F"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <path
        d="M3.5 13.25h17M12 13.25V20.5"
        stroke="#CC922F"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <path
        d="M5.5 9.25V7.5c0-1.1.9-2 2-2h9c1.1 0 2 .9 2 2v1.75"
        stroke="#CC922F"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 20.5v1.25M15.5 20.5v1.25"
        stroke="#CC922F"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </svg>
  );

  const TapisIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill="#CC922F"
      stroke="#CC922F"
      strokeWidth={0}
      className="w-12 h-12 shrink-0"
      aria-hidden
    >
      <path d="M395.13,139.13H116.87c-9.22,0-16.696,7.475-16.696,16.696v200.348c0,9.22,7.475,16.696,16.696,16.696H395.13 c9.22,0,16.696-7.475,16.696-16.696V155.826C411.826,146.606,404.351,139.13,395.13,139.13z M378.435,339.478h-244.87V172.522 h244.87V339.478z" />
      <path d="M335.344,240.841l-72.348-33.391c-4.439-2.05-9.554-2.05-13.993,0l-72.348,33.391c-5.912,2.728-9.699,8.646-9.699,15.159 s3.787,12.43,9.699,15.159l72.348,33.391c2.219,1.025,4.608,1.537,6.997,1.537c2.389,0,4.777-0.512,6.997-1.537l72.348-33.391 c5.912-2.728,9.699-8.646,9.699-15.159S341.257,243.57,335.344,240.841z M256,271.003L223.494,256L256,240.997L288.506,256 L256,271.003z" />
      <path d="M495.304,172.522c9.22,0,16.696-7.475,16.696-16.696s-7.475-16.696-16.696-16.696h-16.696v-33.391h16.696 c9.22,0,16.696-7.475,16.696-16.696c0-9.22-7.475-16.696-16.696-16.696h-33.391H61.217h-11.13H16.696 C7.475,72.348,0,79.823,0,89.044c0,9.22,7.475,16.696,16.696,16.696h16.696v33.391H16.696C7.475,139.13,0,146.606,0,155.826 s7.475,16.696,16.696,16.696h16.696v33.391H16.696C7.475,205.913,0,213.388,0,222.609s7.475,16.696,16.696,16.696h16.696v33.391 H16.696C7.475,272.696,0,280.171,0,289.391s7.475,16.696,16.696,16.696h16.696v33.391H16.696C7.475,339.478,0,346.953,0,356.174 c0,9.22,7.475,16.696,16.696,16.696h16.696v33.391H16.696C7.475,406.261,0,413.736,0,422.957c0,9.22,7.475,16.696,16.696,16.696 h33.391h11.13h400.696h33.391c9.22,0,16.696-7.475,16.696-16.696c0-9.22-7.475-16.696-16.696-16.696h-16.696V372.87h16.696 c9.22,0,16.696-7.475,16.696-16.696c0-9.22-7.475-16.696-16.696-16.696h-16.696v-33.391h16.696c9.22,0,16.696-7.475,16.696-16.696 s-7.475-16.696-16.696-16.696h-16.696v-33.391h16.696c9.22,0,16.696-7.475,16.696-16.696s-7.475-16.696-16.696-16.696h-16.696 v-33.391H495.304z M445.217,406.261H66.783V105.739h378.435V406.261z" />
    </svg>
  );

  /** Salon — canapé 3 places */
  const Canape3PlacesIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className="w-12 h-12 shrink-0"
      aria-hidden
    >
      <path
        d="M5.55556 18H18.4444C20.4081 18 22 16.4081 22 14.4444V12C22 10.8954 21.1046 10 20 10C18.8954 10 18 10.8954 18 12V13.2C18 13.6418 17.6418 14 17.2 14H6.8C6.35817 14 6 13.6418 6 13.2V12C6 10.8954 5.10457 10 4 10C2.89543 10 2 10.8954 2 12V14.4444C2 16.4081 3.59188 18 5.55556 18Z"
        stroke="#CC922F"
        strokeWidth={1.5}
      />
      <path
        d="M20 10C20 9.07069 20 8.60603 19.9231 8.21964C19.6075 6.63288 18.3671 5.39249 16.7804 5.07686C16.394 5 15.9293 5 15 5H9C8.07069 5 7.60603 5 7.21964 5.07686C5.63288 5.39249 4.39249 6.63288 4.07686 8.21964C4 8.60603 4 9.07069 4 10"
        stroke="#CC922F"
        strokeWidth={1.5}
      />
      <path d="M12 5V14" stroke="#CC922F" strokeWidth={1.5} />
      <path
        d="M20 19V18M4 19V18"
        stroke="#CC922F"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </svg>
  );

  /** Salon — canapé d'angle */
  const CanapeAngleIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="#CC922F"
      className="w-12 h-12 shrink-0"
      aria-hidden
    >
      <path d="M7 4C5.3550302 4 4 5.3550302 4 7L4 8.1816406C3.7749277 8.0988815 3.5394844 8.0375539 3.2871094 8.0136719L3.2851562 8.0136719L3.2832031 8.0136719C2.6956383 7.9593227 2.0975168 8.0789836 1.5742188 8.3613281C0.16654993 9.1184219 -0.29860155 10.832824 0.26367188 12.236328L1.9628906 16.486328C2.4842054 17.787329 3.6480233 18.703727 5 18.9375L5 21L7 21L7 19L17 19L17 21L19 21L19 18.935547C20.352474 18.701653 21.51686 17.786714 22.037109 16.484375L23.769531 12.214844L23.771484 12.212891C24.310637 10.863481 23.896019 9.2254763 22.582031 8.4355469C22.112992 8.1535386 21.573166 8 21.027344 8C20.669496 8 20.324639 8.0704493 20 8.1894531L20 7C20 5.3550302 18.64497 4 17 4L7 4 z M 7 6L17 6C17.56503 6 18 6.4349698 18 7L18 10.474609L16.972656 13L7.03125 13L6 10.421875L6 7C6 6.4349698 6.4349698 6 7 6 z M 21.027344 10C21.211522 10 21.377821 10.044449 21.550781 10.148438C21.946794 10.386508 22.114863 10.96816 21.914062 11.470703L20.179688 15.740234L20.179688 15.742188C19.875347 16.503993 19.143398 17 18.322266 17L5.6777344 17C4.8584657 17 4.125776 16.504733 3.8203125 15.744141L3.8203125 15.742188L2.1210938 11.494141L2.1210938 11.492188C1.9097193 10.964664 2.0972168 10.35068 2.5214844 10.123047L2.5234375 10.121094C2.7075381 10.021764 2.8861235 9.9846829 3.0976562 10.003906C3.4440291 10.036686 3.8135404 10.336585 3.984375 10.763672L5.6777344 15L18.318359 15L20.09375 10.634766L20.095703 10.630859C20.248971 10.247062 20.61453 10 21.027344 10 z" />
    </svg>
  );

  /** Salon — chaîne hi-fi */
  const HifiIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 511.999 511.999"
      fill="#CC922F"
      stroke="#CC922F"
      strokeWidth={0}
      className="w-12 h-12 shrink-0"
      aria-hidden
    >
      <path d="M492.308,78.768H19.692C8.817,78.768,0,87.585,0,98.461v315.077c0,10.875,8.817,19.692,19.692,19.692h472.615 c10.875,0,19.692-8.817,19.692-19.692V98.461C512,87.585,503.183,78.768,492.308,78.768z M354.461,118.153h118.154v59.131 c-16.468-12.39-36.928-19.746-59.077-19.746s-42.609,7.356-59.077,19.746V118.153z M39.384,118.153h118.154v59.131 c-16.468-12.39-36.928-19.746-59.077-19.746s-42.609,7.356-59.077,19.746V118.153z M157.539,393.846L157.539,393.846H39.385 v-59.131c16.468,12.39,36.928,19.746,59.077,19.746c22.149,0,42.609-7.356,59.077-19.746V393.846z M98.462,315.076 c-32.575,0-59.077-26.502-59.077-59.077c0-32.575,26.502-59.077,59.077-59.077c32.575,0,59.077,26.502,59.077,59.077 S131.037,315.076,98.462,315.076z M236.308,393.846h-39.385v-39.385h39.385V393.846z M236.308,315.076h-39.385v-39.385h39.385 V315.076z M236.308,236.307h-39.385v-39.385h39.385V236.307z M236.308,157.537h-39.385v-39.385h39.385V157.537z M315.077,393.846 h-39.385v-39.385h39.385V393.846z M315.077,315.076h-39.385v-39.385h39.385V315.076z M315.077,236.307h-39.385v-39.385h39.385 V236.307z M315.077,157.537h-39.385v-39.385h39.385V157.537z M413.538,196.922c32.575,0,59.077,26.502,59.077,59.077 s-26.502,59.077-59.077,59.077s-59.077-26.502-59.077-59.077C354.461,223.424,380.963,196.922,413.538,196.922z M472.616,393.846 h-0.001H354.462v-59.131c16.468,12.39,36.928,19.746,59.077,19.746s42.609-7.356,59.077-19.746V393.846z" />
      <path d="M427.467,242.07c-3.676-3.663-8.743-5.763-13.929-5.763s-10.266,2.101-13.929,5.763 c-3.663,3.676-5.763,8.743-5.763,13.929c0,5.186,2.101,10.266,5.763,13.929c3.663,3.663,8.743,5.763,13.929,5.763 c5.186,0,10.266-2.101,13.929-5.763c3.663-3.663,5.763-8.743,5.763-13.929C433.231,250.813,431.13,245.747,427.467,242.07z" />
      <path d="M112.391,242.07c-3.663-3.663-8.743-5.763-13.929-5.763c-5.186,0-10.266,2.101-13.929,5.763 c-3.663,3.662-5.763,8.743-5.763,13.929c0,5.186,2.101,10.266,5.763,13.929c3.663,3.663,8.743,5.763,13.929,5.763 c5.186,0,10.266-2.101,13.929-5.763c3.663-3.676,5.763-8.743,5.763-13.929C118.154,250.813,116.053,245.747,112.391,242.07z" />
    </svg>
  );

  /** Salon — lampadaire */
  const LampadaireIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 504.864 504.864"
      fill="#CC922F"
      stroke="#CC922F"
      strokeWidth={0}
      className="w-12 h-12 shrink-0"
      aria-hidden
    >
      <path d="M316.321,448H188.657c-20.016,0-36.912,17.808-36.912,38.88c0,8.832,7.168,16,16,16c8.832,0,16-7.168,16-16 c0-3.488,3.104-6.88,4.912-6.88l127.504-0.016c1.632,0.416,5.072,4.88,5.072,8.88c0,8.832,7.168,16,16,16c8.832,0,16-7.168,16-16 C353.233,469.536,338.065,448,316.321,448z" />
      <path d="M360.609,185.104L317.105,12.096C315.313,4.992,308.913,0,301.585,0h-98.64c-7.344,0-13.728,4.992-15.52,12.112 l-44.24,176c-1.2,4.768-0.128,9.84,2.896,13.728c3.04,3.888,7.696,6.16,12.624,6.16h187.136c0.112,0,0.208,0,0.32,0 c8.832,0,16-7.168,16-16.016C362.161,189.52,361.601,187.184,360.609,185.104z M179.233,176l36.192-144h73.68l36.208,144H179.233z " />
      <path d="M252.273,176c-8.832,0-16,7.168-16,16v272c0,8.832,7.168,16,16,16c8.832,0,16-7.168,16-16V192 C268.273,183.168,261.105,176,252.273,176z" />
      <path d="M268.273,128h-80c-8.832,0-16,7.168-16,16c0,8.832,7.168,16,16,16h80c8.832,0,16-7.168,16-16 C284.273,135.168,277.105,128,268.273,128z" />
      <path d="M268.273,80h-80c-8.832,0-16,7.168-16,16c0,8.832,7.168,16,16,16h80c8.832,0,16-7.168,16-16 C284.273,87.168,277.105,80,268.273,80z" />
    </svg>
  );

  const MeubleTvBasIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      fill="#CC922F"
      className="w-12 h-12 shrink-0"
      aria-hidden
    >
      <path d="M30,18H24a1,1,0,0,0-1,1v1H9V19a1,1,0,0,0-1-1H2a1,1,0,0,0-1,1V30a1,1,0,0,0,1,1H30a1,1,0,0,0,1-1V19A1,1,0,0,0,30,18Zm-7,4v4H9V22ZM3,20H7v9H3Zm6,8H23v1H9Zm20,1H25V20h4Z" />
      <path d="M28,17a1,1,0,0,0,1-1V4a1,1,0,0,0-1-1H4.13a1,1,0,0,0-1,1V16a1,1,0,0,0,1,1ZM5.13,5H27V15H5.13Z" />
      <rect height="2" width="4" x="14" y="23" fill="#CC922F" />
    </svg>
  );

  const TableBasseIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 50 50"
      fill="#CC922F"
      stroke="#CC922F"
      strokeWidth={1.05}
      className="w-12 h-12 shrink-0"
      aria-hidden
    >
      <path d="M10.585938 11L0.38085938 21.205078 A 1.0001 1.0001 0 0 0 0.18945312 21.396484L0 21.585938L0 21.832031 A 1.0001 1.0001 0 0 0 0 22.158203L0 28L3 28L3 50L9 50L9 28L11 28L11 43L17 43L17 28L33 28L33 43L39 43L39 28L41 28L41 50L47 50L47 28L50 28L50 22.167969 A 1.0001 1.0001 0 0 0 50 21.841797L50 21.585938L49.806641 21.392578 A 1.0001 1.0001 0 0 0 49.623047 21.207031 A 1.0001 1.0001 0 0 0 49.617188 21.203125L39.414062 11L39 11L10.585938 11 z M 11.414062 13L38.585938 13L46.585938 21L3.4140625 21L11.414062 13 z M 2 23L48 23L48 26L46.167969 26 A 1.0001 1.0001 0 0 0 45.841797 26L42.154297 26 A 1.0001 1.0001 0 0 0 41.984375 25.986328 A 1.0001 1.0001 0 0 0 41.839844 26L38.167969 26 A 1.0001 1.0001 0 0 0 37.841797 26L34.154297 26 A 1.0001 1.0001 0 0 0 33.984375 25.986328 A 1.0001 1.0001 0 0 0 33.839844 26L16.167969 26 A 1.0001 1.0001 0 0 0 15.841797 26L12.154297 26 A 1.0001 1.0001 0 0 0 11.984375 25.986328 A 1.0001 1.0001 0 0 0 11.839844 26L8.1679688 26 A 1.0001 1.0001 0 0 0 7.8417969 26L4.1542969 26 A 1.0001 1.0001 0 0 0 3.984375 25.986328 A 1.0001 1.0001 0 0 0 3.8398438 26L2 26L2 23 z M 5 28L7 28L7 48L5 48L5 28 z M 13 28L15 28L15 41L13 41L13 28 z M 35 28L37 28L37 41L35 41L35 28 z M 43 28L45 28L45 48L43 48L43 28 z" />
    </svg>
  );

  const TelevisionIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="#CC922F" className="w-12 h-12 shrink-0" aria-hidden>
      <path d="M44,4H4A2,2,0,0,0,2,6V34a2,2,0,0,0,2,2H22v4H13a2,2,0,0,0,0,4H35a2,2,0,0,0,0-4H26V36H44a2,2,0,0,0,2-2V6A2,2,0,0,0,44,4ZM42,32H6V8H42Z" />
    </svg>
  );

  const FauteuilIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1024 1024"
      fill="#CC922F"
      className="w-12 h-12 shrink-0"
      aria-hidden
    >
      <path d="M788 946.4c-11.2 0-20.8-8.8-20.8-20v-21.6H256.8v21.6c0 11.2-9.6 20-20.8 20-11.2 0-20.8-8.8-20.8-20V904l-2.4-0.8c-43.2-8-74.4-44-74.4-86.4v-200l0.8-22.4h-2.4C60 584 3.2 519.2 3.2 445.6c0-76 59.2-140 136.8-149.6h2.4v-77.6c0-64.8 36-130.4 116-130.4h512c31.2 0 58.4 10.4 78.4 30.4 23.2 23.2 36 59.2 36 100l0.8 77.6h2.4c75.2 11.2 132 75.2 132 148.8 0 73.6-57.6 137.6-132.8 148.8h-2.4l0.8 22.4v200.8c0 42.4-31.2 78.4-74.4 86.4l-2.4 0.8v22.4c-0.8 11.2-9.6 20-20.8 20zM160 334.4c-64 0-116 50.4-116 111.2s52 112 116 112c5.6 0 11.2 2.4 14.4 5.6 4 4 5.6 8.8 5.6 14.4l-0.8 40.8v200c0 26.4 22.4 48.8 50.4 48.8h564c28 0 50.4-21.6 50.4-48.8v-200l-0.8-40.8c0-5.6 1.6-10.4 5.6-14.4 4-4 8.8-5.6 14.4-5.6 64 0 116-49.6 116-111.2s-51.2-112-115.2-112c-63.2 0-115.2 49.6-116 110.4l1.6 20v202.4c0 11.2-9.6 20-20.8 20H294.4c-11.2 0-20.8-8.8-20.8-20V466.4v-1.6l1.6-19.2c0-61.6-52-111.2-115.2-111.2zM266.4 136c-49.6 0-71.2 44-71.2 87.2v76l2.4 0.8c64.8 11.2 114.4 60.8 123.2 123.2V640H704V422.4c9.6-62.4 62.4-113.6 128-123.2h2.4V224c0-43.2-21.6-87.2-70.4-87.2H266.4z" />
    </svg>
  );

  const PoufIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512.004 512.004"
      fill="#CC922F"
      stroke="#CC922F"
      strokeWidth={0}
      className="w-12 h-12 shrink-0"
      aria-hidden
    >
      <path d="M512.003,68.395c0-34.896-26.601-64.87-61.709-68.092c-20.567-1.881-39.712,5.224-53.488,17.893 C384.544,6.901,367.997,0,349.87,0c-18.126,0-34.672,6.9-46.933,18.193C290.675,6.9,274.129,0,256.003,0 s-34.672,6.9-46.933,18.193C196.808,6.9,180.262,0,162.137,0c-18.127,0-34.674,6.901-46.936,18.195 C101.424,5.527,82.279-1.579,61.719,0.302C26.605,3.525,0.003,33.499,0.003,68.395v111.253c0,2.38,0.25,4.696,0.721,6.928 c-0.456,1.735-0.723,3.547-0.723,5.426v234.667c0,11.782,9.551,21.333,21.333,21.333h88.138l-20.555,30.833 c-6.536,9.803-3.886,23.049,5.917,29.584s23.048,3.886,29.584-5.917l36.334-54.5h190.499l36.334,54.5 c6.536,9.803,19.781,12.452,29.584,5.917c9.803-6.536,12.452-19.781,5.917-29.584l-20.555-30.833h88.138 c11.782,0,21.333-9.551,21.333-21.333V192.002c0-1.876-0.267-3.686-0.721-5.419c0.473-2.234,0.723-4.553,0.723-6.935V68.395z M42.67,68.395c0-13.094,10.053-24.421,22.942-25.604c15.461-1.414,28.258,9.834,28.258,23.663c0,28.444,42.667,28.444,42.667,0 c0-12.944,11.279-23.787,25.6-23.787c14.321,0,25.6,10.843,25.6,23.787c0,28.444,42.667,28.444,42.667,0 c0-12.944,11.279-23.787,25.6-23.787c14.321,0,25.6,10.843,25.6,23.787c0,28.444,42.667,28.444,42.667,0 c0-12.944,11.279-23.787,25.6-23.787c14.321,0,25.6,10.843,25.6,23.787c0,28.444,42.667,28.444,42.667,0 c0-13.829,12.797-25.077,28.265-23.662c12.882,1.182,22.935,12.51,22.935,25.603v102.272H42.67V68.395z M469.335,405.336h-106.52 c-0.027,0-0.053,0-0.08,0H149.268c-0.027,0-0.053,0-0.08,0H42.668v-192h426.667V405.336z" />
    </svg>
  );

  const EtendoirIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      fill="#CC922F"
      className="w-12 h-12 shrink-0"
      aria-hidden
    >
      <path d="M30,9H2a1,1,0,0,0-1,1v3a1,1,0,0,0,1,1v2a1,1,0,0,0,1,1H4.73L14,22.42,2.5,29.14A1,1,0,0,0,3,31a.9.9,0,0,0,.5-.14L16,23.57l12.5,7.29A.9.9,0,0,0,29,31a1,1,0,0,0,.5-1.86L18,22.42,27.27,17H29a1,1,0,0,0,1-1V14a1,1,0,0,0,1-1V10A1,1,0,0,0,30,9ZM3,11H29v1H3ZM16,21.26,8.7,17H23.3ZM28,15H4V14H28Z" />
    </svg>
  );

  // Room-based object organization (matching backend)
  const ROOM_OBJECTS = {
    "Entrée": [
      "Banc", "Cadre", "Carton", "Console", "Etagére muale",
      "Meuble a chaussure", "Miroir", "Porte manteau",
      "Coffre pour chaussures", "Tapis"
    ],
    "Salle de bain": [
      "Boîte ou panier", "Carton", "Coffre a linge", "Colonne salle de bain",
      "Lave linge", "Meuble salle de bain", "Miroir", "Tapis petit",
      "Baignoire enfant"
    ],
    "Salon": [
      "Canapé 3 places (-80KG)", "Canapé d'angle (-80KG)", "Carton", "hifi",
      "Lampadaire", "Meuble TV bas", "Table basse", "Télevision",
      "Fauteuil", "Pouf", "Tapis", "Cadre", "Miroir", "Banc", "Etendoir"
    ],
    "Cuisine": [
      "Boîte ou panier", "Carton", "Cuisinière (-80KG)", "Four",
      "Frigo-congélateur", "Lave vaisselle", "Micro ondes", "Etagère",
      "Meuble bas de cuisine", "Meuble haut de cuisine", "Tabouret", "Chaise", "Four piano 6 têtes"
    ],
    "Salle à manger": [
      "Buffet haut", "Cadre", "Chaise", "Moyenne table", "Plante en pot",
      "Tapis moyen", "Vaisselier (-80KG)",
      "Commode", "Buffet complet haut + bas", "Bibliothèque"
    ],
    "Chambre": [
      "Armoire 2p (-80KG)", "Bureau", "Carton", "Chaise de bureau",
      "Commode", "lit double", "lit simple", "Tapis moyen",
      "Table de nuit", "Banc", "Tête de lit", "TV", "Table à langer bébé", "Coiffeuse"
    ],
    "Cave": [
      "Armoire ancienne (-80KG)", "Barbecue", "Carton", "Coffre de rangement",
      "Echelle", "Escabeau", "valises", "Etagére",
      "Climatisation"
    ],
    "Jardin": [
      "Carton", "Chaise", "Coffre de rangement", "Etendoir",
      "Parasol", "Table de jardin", "Transat", "Vélo",
      "Poussette", "Scooter (moto)"
    ],
    "Garage": [
      "Aspirateur", "Carton", "Coffre de rangement", "Lave linge",
      "séche linge", "Vélo", "Table de ping-pong (-80KG)", "Etagère"
    ],
    "Autre": [
      "Carton", "Chiffronier", "Guitare", "Lampe de bureau",
      "Paravent", "Vélo d'intérieur (-80KG)", "Tapis de course (-80KG)",
      "Banc de musculation (-80KG)",
      "Ecran ordinateur", "Imprimante", "Imprimante pro", "Cave à vin"
    ]
  };

  // Get objects for the selected room
  const getObjectsForRoom = (room: string) => {
    return ROOM_OBJECTS[room as keyof typeof ROOM_OBJECTS] || [];
  };

  // Get all objects for display (filtered by search and room)
  const getFilteredObjects = () => {
    const roomObjects = selectedRoom ? getObjectsForRoom(selectedRoom) : [];
    const allObjects = Object.values(ROOM_OBJECTS).flat();
    const objectsToShow = selectedRoom ? roomObjects : allObjects;

    // Add custom objects from cleaningQuantities
    const customObjects = Object.keys(cleaningQuantities).filter(obj =>
      !Object.values(ROOM_OBJECTS).flat().includes(obj)
    );

    // Combine predefined objects with custom objects
    const allObjectsWithCustom = [...objectsToShow, ...customObjects];

    return allObjectsWithCustom.filter(obj =>
      obj.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getObjectIcon = (objectName: string) => {
    const normalized = objectName.trim().toLowerCase();
    if (normalized === "banc") return <BancIcon />;
    if (normalized === "cadre") return <CadreIcon />;
    if (normalized === "carton") return <CartonIcon />;
    if (normalized === "console") return <ConsoleIcon />;
    if (normalized === "etagére muale") return <EtagereMuraleIcon />;
    if (normalized === "meuble a chaussure") return <MeubleChaussureIcon />;
    if (normalized === "miroir") return <MiroirIcon />;
    if (normalized === "porte manteau") return <PorteManteauIcon />;
    if (normalized === "coffre pour chaussures") return <CoffreChaussuresIcon />;
    if (normalized === "tapis") return <TapisIcon />;
    if (normalized === "canapé 3 places (-80kg)") return <Canape3PlacesIcon />;
    if (normalized === "canapé d'angle (-80kg)") return <CanapeAngleIcon />;
    if (normalized === "hifi") return <HifiIcon />;
    if (normalized === "lampadaire") return <LampadaireIcon />;
    if (normalized === "meuble tv bas") return <MeubleTvBasIcon />;
    if (normalized === "table basse") return <TableBasseIcon />;
    if (normalized === "télevision") return <TelevisionIcon />;
    if (normalized === "fauteuil") return <FauteuilIcon />;
    if (normalized === "pouf") return <PoufIcon />;
    if (normalized === "etendoir") return <EtendoirIcon />;
    if (normalized === "boîte ou panier" || normalized === "coffre a linge") return <BoiteOuPanierIcon />;
    if (normalized === "cuisinière (-80kg)") return <CuisiniereIcon />;
    if (normalized === "four") return <FourIcon />;
    if (normalized === "frigo-congélateur") return <FrigoCongelateurIcon />;
    if (normalized === "lave vaisselle") return <LaveVaisselleIcon />;
    if (normalized === "micro ondes") return <MicroOndesIcon />;
    if (normalized === "etagère" || normalized === "étagère") return <EtagereCuisineIcon />;
    if (normalized === "meuble bas de cuisine") return <MeubleBasCuisineIcon />;
    if (normalized === "meuble haut de cuisine") return <MeubleHautCuisineIcon />;
    if (normalized === "tabouret") return <TabouretIcon />;
    if (normalized === "chaise") return <ChaiseIcon />;
    if (normalized === "four piano 6 têtes") return <FourPiano6TetesIcon />;
    if (normalized === "buffet haut") return <MeubleHautCuisineIcon />;
    if (normalized === "moyenne table") return <MoyenneTableIcon />;
    if (normalized === "plante en pot") return <PlanteEnPotIcon />;
    if (normalized === "tapis moyen") return <TapisMoyenIcon />;
    if (normalized === "tapis petit") return <TapisPetitIcon />;
    if (normalized === "vaisselier (-80kg)") return <VaisselierIcon />;
    if (normalized === "commode") return <CommodeIcon />;
    if (normalized === "buffet complet haut + bas") return <BuffetCompletHautBasIcon />;
    if (normalized === "bibliothèque" || normalized === "bibliotheque") return <BibliothequeIcon />;
    if (normalized === "armoire 2p (-80kg)") return <Armoire2pIcon />;
    if (normalized === "armoire ancienne (-80kg)") return <ArmoireAncienneIcon />;
    if (normalized === "bureau") return <BureauIcon />;
    if (normalized === "chaise de bureau") return <ChaiseBureauIcon />;
    if (normalized === "lit double") return <LitDoubleIcon />;
    if (normalized === "lit simple") return <LitSimpleIcon />;
    if (normalized === "table de nuit") return <TableDeNuitIcon />;
    if (normalized === "tête de lit") return <TeteDeLitIcon />;
    if (normalized === "table à langer bébé") return <TableALangerBebeIcon />;
    if (normalized === "coiffeuse") return <CoiffeuseIcon />;
    if (normalized === "tv") return <TvIcon />;
    if (normalized === "colonne salle de bain") return <ColonneSalleDeBainIcon />;
    if (normalized === "lave linge") return <LaveLingeIcon />;
    if (normalized === "meuble salle de bain") return <MeubleSalleDeBainIcon />;
    if (normalized === "baignoire enfant") return <BaignoireEnfantIcon />;
    if (normalized === "barbecue") return <BarbecueIcon />;
    if (normalized === "coffre de rangement") return <CoffreRangementIcon />;
    if (normalized === "echelle") return <EchelleIcon />;
    if (normalized === "escabeau") return <EscabeauIcon />;
    if (normalized === "valises") return <ValisesIcon />;
    if (normalized === "étagère" || normalized === "etagere" || normalized === "etagére") return <EtagereCaveIcon />;
    if (normalized === "climatisation") return <ClimatisationIcon />;
    if (normalized === "parasol") return <ParasolIcon />;
    if (normalized === "table de jardin") return <TableDeJardinIcon />;
    if (normalized === "transat") return <TransatIcon />;
    if (normalized === "vélo") return <VeloIcon />;
    if (normalized === "poussette") return <PoussetteIcon />;
    if (normalized === "scooter (moto)") return <ScooterMotoIcon />;
    if (normalized === "aspirateur") return <AspirateurIcon />;
    if (normalized === "séche linge") return <SecheLingeIcon />;
    if (normalized === "table de ping-pong" || normalized === "table de ping-pong (-80kg)") return <TablePingPongIcon />;
    if (normalized === "chiffronier") return <ChiffronierIcon />;
    if (normalized === "guitare") return <GuitareIcon />;
    if (normalized === "lampe de bureau") return <LampeDeBureauIcon />;
    if (normalized === "paravent") return <ParaventIcon />;
    if (
      normalized === "vélo d'intérieur" ||
      normalized === "vélo d'intérieur (-80kg)" ||
      normalized === "vélo d'interieur (-80kg)"
    )
      return <VeloInterieurIcon />;
    if (normalized === "tapis de course" || normalized === "tapis de course (-80kg)") return <TapisDeCourseIcon />;
    if (normalized === "banc de musculation" || normalized === "banc de musculation (-80kg)") return <BancDeMusculationIcon />;
    if (normalized === "ecran ordinateur") return <EcranOrdinateurIcon />;
    if (normalized === "imprimante") return <ImprimanteIcon />;
    if (normalized === "imprimante pro") return <ImprimanteProIcon />;
    if (normalized === "cave à vin") return <CaveAVinIcon />;
    return <BoxIcon />;
  };

  const movingItems = getFilteredObjects().map(obj => ({
    name: obj,
    icon: getObjectIcon(obj),
  }));

  // Room icons mapping for AI method
  const getRoomIcon = (room: string) => {
    const roomIcons: Record<string, React.ReactNode> = {
      "Entrée": <Home className="w-6 h-6" />,
      "Salon": <Sofa className="w-6 h-6" />,
      "Cuisine": <Utensils className="w-6 h-6" />,
      "Salle à manger": <Users className="w-6 h-6" />,
      "Chambre": <Bed className="w-6 h-6" />,
      "Salle de bain": <Bath className="w-6 h-6" />,
      "Cave": <Archive className="w-6 h-6" />,
      "Jardin": <TreePine className="w-6 h-6" />,
      "Garage": <Car className="w-6 h-6" />,
      "Autre": <Package className="w-6 h-6" />
    };
    return roomIcons[room] || <Package className="w-6 h-6" />;
  };

  // Predefined special objects over 80kg (from backend)
  const predefinedSpecialObjects = [
    "Piano droit (max 200kgs)",
    "Piano à queue (max 300kgs)",
    "Armoire forte (max 200kgs)",
    "Coffre fort (max 200kgs)",
    "Réfrigérateur américain (max 150kgs)",
    "Armoire ancienne (max 150kgs)",
    "Lave linge (max 150kgs)",
    "Banc de musculation (max 150kgs)"
  ];

  const getSpecialHeavyObjectIcon = (objectName: string) => {
    const n = objectName.trim().toLowerCase();
    if (n === "piano droit (max 200kgs)") return <PianoDroitHeavyIcon />;
    if (n === "piano à queue (max 300kgs)") return <PianoQueueHeavyIcon />;
    if (n === "armoire forte (max 200kgs)") return <ArmoireForteHeavyIcon />;
    if (n === "coffre fort (max 200kgs)") return <CoffreRangementIcon />;
    if (n === "réfrigérateur américain (max 150kgs)") return <RefrigerateurAmericainHeavyIcon />;
    if (n === "armoire ancienne (max 150kgs)") return <ArmoireAncienneHeavyIcon />;
    if (n === "lave linge (max 150kgs)") return <LaveLingeHeavyIcon />;
    if (n === "banc de musculation (max 150kgs)") return <BancDeMusculationIcon />;
    return <BoxIcon />;
  };

  // Custom heavy objects added by user (for manual method)
  const [customHeavyObjects, setCustomHeavyObjects] = useState<string[]>([]);

  // Custom heavy objects added by user (for AI method)
  const [aiCustomHeavyObjects, setAiCustomHeavyObjects] = useState<string[]>([]);

  // Custom heavy objects added by user (for superficie method)
  const [superficieCustomHeavyObjects, setSuperficieCustomHeavyObjects] = useState<string[]>([]);

  // Combined list: predefined + custom (custom objects always at the end)
  const specialObjects = [...predefinedSpecialObjects, ...customHeavyObjects];

  // AI method special objects (separate from manual method)
  const aiSpecialObjects = [...predefinedSpecialObjects, ...aiCustomHeavyObjects];

  // Superficie method special objects (separate from manual and AI methods)
  const superficieSpecialObjects = [...predefinedSpecialObjects, ...superficieCustomHeavyObjects];

  const updateSpecialObjectQuantity = (object: string, change: number) => {
    setSpecialObjectQuantities(prev => ({
      ...prev,
      [object]: Math.max(0, (prev[object] || 0) + change),
    }));
  };

  const handleSpecialObjectsToggle = () => {
    if (hasSpecialObjects) {
      // If turning off, reset all quantities to 0
      setSpecialObjectQuantities({});
    }
    setHasSpecialObjects(!hasSpecialObjects);
  };

  const handleAddCustomRoom = () => {
    if (newRoomName.trim() && !rooms.includes(newRoomName.trim()) && !customRooms.includes(newRoomName.trim())) {
      setCustomRooms(prev => [...prev, newRoomName.trim()]);
      setNewRoomName("");
      setIsAddingRoom(false);
    }
  };

  const handleRemoveCustomRoom = (roomToRemove: string) => {
    setCustomRooms(prev => prev.filter(room => room !== roomToRemove));
    if (selectedRoom === roomToRemove) {
      setSelectedRoom("");
    }
  };

  const handlePreviousRoomPage = () => {
    const currentSelectedIndex = rooms.indexOf(selectedRoom || rooms[0]);
    const currentViewStart = currentRoomIndex;

    // If we're at the first room of current view, go to previous page
    if (currentSelectedIndex === currentViewStart) {
      const newIndex = Math.max(0, currentRoomIndex - 1);
      setCurrentRoomIndex(newIndex);
      setSelectedRoom(rooms[newIndex]);
    } else {
      // Move to previous room in current view
      const newSelectedIndex = Math.max(currentViewStart, currentSelectedIndex - 1);
      setSelectedRoom(rooms[newSelectedIndex]);
    }
  };

  const handleNextRoomPage = () => {
    const currentSelectedIndex = rooms.indexOf(selectedRoom || rooms[0]);
    const currentViewEnd = currentRoomIndex + 4;

    // If we're at the last room of current view, go to next page
    if (currentSelectedIndex === currentViewEnd) {
      const newIndex = Math.min(rooms.length - 5, currentRoomIndex + 1);
      setCurrentRoomIndex(newIndex);
      // Keep the selection on the last room of the new view
      setSelectedRoom(rooms[newIndex + 4]);
    } else {
      // Move to next room in current view
      const newSelectedIndex = Math.min(currentViewEnd, currentSelectedIndex + 1);
      setSelectedRoom(rooms[newSelectedIndex]);
    }
  };

  const getVisibleRooms = () => {
    return rooms.slice(currentRoomIndex, currentRoomIndex + 5);
  };

  const handleAddPiece = () => {
    if (pieceForm.nature.trim() && pieceForm.quantite.trim()) {
      // Add the piece to the cleaningQuantities
      const objectName = pieceForm.nature.trim();
      const quantity = parseInt(pieceForm.quantite) || 0;

      if (quantity > 0) {
        setCleaningQuantities(prev => ({
          ...prev,
          [objectName]: (prev[objectName] || 0) + quantity
        }));

        // Also add to roomObjectQuantities for the current room (like heavy objects)
        if (selectedRoom) {
          setRoomObjectQuantities(prev => ({
            ...prev,
            [selectedRoom]: {
              ...prev[selectedRoom],
              [objectName]: quantity
            }
          }));
        }

        // Store custom object details with form dimensions
        const length = parseFloat(pieceForm.longueur) || 100;
        const width = parseFloat(pieceForm.largeur) || 50;
        const height = parseFloat(pieceForm.hauteur) || 30;

        setCustomObjectDetails(prev => ({
          ...prev,
          [objectName]: {
            name: objectName,
            quantity: quantity,
            length: length,
            width: width,
            height: height
          }
        }));

        // Show success message
        alert(`Objet "${objectName}" ajouté avec succès!`);
      }

      // Reset form
      setPieceForm({
        nature: "",
        quantite: "",
        longueur: "",
        largeur: "",
        hauteur: ""
      });
      setShowAddPieceForm(false);
    }
  };

  const handleAddHeavyObject = () => {
    if (heavyObjectForm.nature.trim() && heavyObjectForm.quantite.trim()) {
      // Add to custom heavy objects list if not already present
      const newHeavyObject = heavyObjectForm.nature.trim();
      if (!customHeavyObjects.includes(newHeavyObject) && !predefinedSpecialObjects.includes(newHeavyObject)) {
        // Add to the end of custom objects list
        setCustomHeavyObjects(prev => [...prev, newHeavyObject]);
      }

      // Set the quantity
      const quantity = parseInt(heavyObjectForm.quantite) || 1;
      setSpecialObjectQuantities(prev => ({
        ...prev,
        [newHeavyObject]: quantity
      }));

      // Store custom heavy object details with form dimensions
      const length = parseFloat(heavyObjectForm.longueur) || 100;
      const width = parseFloat(heavyObjectForm.largeur) || 50;
      const height = parseFloat(heavyObjectForm.hauteur) || 30;

      setCustomHeavyObjectDetails(prev => ({
        ...prev,
        [newHeavyObject]: {
          name: newHeavyObject,
          quantity: quantity,
          length: length,
          width: width,
          height: height
        }
      }));

      // Show success message
      alert(`Objet lourd "${newHeavyObject}" ajouté avec succès!`);

      // Reset form
      setHeavyObjectForm({
        nature: "",
        quantite: "",
        longueur: "",
        largeur: "",
        hauteur: ""
      });
      setShowAddHeavyObjectForm(false);
    }
  };

  const removeCustomHeavyObject = (objectName: string) => {
    // Remove from custom heavy objects list
    setCustomHeavyObjects(prev => prev.filter(obj => obj !== objectName));

    // Remove from quantities
    setSpecialObjectQuantities(prev => {
      const newQuantities = { ...prev };
      delete newQuantities[objectName];
      return newQuantities;
    });

    // Also remove from custom heavy object details
    setCustomHeavyObjectDetails(prev => {
      const newDetails = { ...prev };
      delete newDetails[objectName];
      return newDetails;
    });
  };

  // AI method heavy object handlers
  const handleAddAiHeavyObject = () => {
    if (heavyObjectForm.nature.trim() && heavyObjectForm.quantite.trim()) {
      // Add to AI custom heavy objects list if not already present
      const newHeavyObject = heavyObjectForm.nature.trim();
      if (!aiCustomHeavyObjects.includes(newHeavyObject) && !predefinedSpecialObjects.includes(newHeavyObject)) {
        // Add to the end of AI custom objects list
        setAiCustomHeavyObjects(prev => [...prev, newHeavyObject]);
      }

      // Set the quantity
      const quantity = parseInt(heavyObjectForm.quantite) || 1;
      setSpecialObjectQuantities(prev => ({
        ...prev,
        [newHeavyObject]: quantity
      }));

      // Store AI custom heavy object details with form dimensions
      const length = parseFloat(heavyObjectForm.longueur) || 100;
      const width = parseFloat(heavyObjectForm.largeur) || 50;
      const height = parseFloat(heavyObjectForm.hauteur) || 30;

      setAiCustomHeavyObjectDetails(prev => ({
        ...prev,
        [newHeavyObject]: {
          name: newHeavyObject,
          quantity: quantity,
          length: length,
          width: width,
          height: height
        }
      }));

      // Show success message
      alert(`Objet lourd "${newHeavyObject}" ajouté avec succès!`);

      // Reset form
      setHeavyObjectForm({
        nature: "",
        quantite: "",
        longueur: "",
        largeur: "",
        hauteur: ""
      });
      setShowAddHeavyObjectForm(false);
    }
  };

  const removeAiCustomHeavyObject = (objectName: string) => {
    // Remove from AI custom heavy objects list
    setAiCustomHeavyObjects(prev => prev.filter(obj => obj !== objectName));

    // Remove from quantities
    setSpecialObjectQuantities(prev => {
      const newQuantities = { ...prev };
      delete newQuantities[objectName];
      return newQuantities;
    });

    // Also remove from AI custom heavy object details
    setAiCustomHeavyObjectDetails(prev => {
      const newDetails = { ...prev };
      delete newDetails[objectName];
      return newDetails;
    });
  };

  // Superficie method custom heavy object handlers
  const handleAddSuperficieHeavyObject = () => {
    if (heavyObjectForm.nature.trim() && heavyObjectForm.quantite.trim()) {
      // Add to superficie custom heavy objects list if not already present
      const newHeavyObject = heavyObjectForm.nature.trim();
      if (!superficieCustomHeavyObjects.includes(newHeavyObject) && !predefinedSpecialObjects.includes(newHeavyObject)) {
        // Add to the end of superficie custom objects list
        setSuperficieCustomHeavyObjects(prev => [...prev, newHeavyObject]);
      }

      // Store the custom heavy object details
      const quantity = parseInt(heavyObjectForm.quantite) || 1;
      const length = parseFloat(heavyObjectForm.longueur) || 100;
      const width = parseFloat(heavyObjectForm.largeur) || 50;
      const height = parseFloat(heavyObjectForm.hauteur) || 30;

      setSuperficieCustomHeavyObjectDetails(prev => ({
        ...prev,
        [newHeavyObject]: {
          name: newHeavyObject,
          quantity: quantity,
          length: length,
          width: width,
          height: height
        }
      }));

      // Set the quantity in the main quantities state
      setSpecialObjectQuantities(prev => ({
        ...prev,
        [newHeavyObject]: quantity
      }));

      alert(`Objet lourd "${newHeavyObject}" ajouté avec succès!`);
      setHeavyObjectForm({
        nature: "",
        quantite: "",
        longueur: "",
        largeur: "",
        hauteur: ""
      });
      setShowAddHeavyObjectForm(false);
    }
  };

  const removeSuperficieCustomHeavyObject = (objectName: string) => {
    setSuperficieCustomHeavyObjects(prev => prev.filter(obj => obj !== objectName));
    setSpecialObjectQuantities(prev => {
      const newQuantities = { ...prev };
      delete newQuantities[objectName];
      return newQuantities;
    });
    // Also remove from custom heavy object details
    setSuperficieCustomHeavyObjectDetails(prev => {
      const newDetails = { ...prev };
      delete newDetails[objectName];
      return newDetails;
    });
  };

  // Check if user has either uploaded images or added special objects
  const canContinueAI = () => {
    const hasImages = uploadedImages.length > 0;
    const hasSpecialObjectsSelected = hasSpecialObjects && Object.values(specialObjectQuantities).some(qty => qty > 0);
    return hasImages || hasSpecialObjectsSelected;
  };


  const _dateOptions = [
    { date: "ven. 29/08", price: null, selected: false },
    { date: "sam. 30/08", price: null, selected: false },
    { date: "dim. 31/08", price: null, selected: false },
    { date: "lun. 01/09", price: "1627.03 €", selected: false },
    {
      date: "mar. 02/09",
      price: "1697.08 €",
      selected: true,
      discount: "1 dispos",
    },
    {
      date: "mer. 03/09",
      price: "1611.71 €",
      selected: false,
      discount: "Moins cher",
    },
    { date: "jeu. 04/09", price: "1631.07 €", selected: false },
  ];

  // Dedicated confirmation page after sending quote
  if (currentPage === "quote-confirmation") {
    return (
      <div className="bg-slate-50 min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <button
                onClick={() => navigate("/")}
                className="hover:opacity-80 transition-opacity cursor-pointer"
                aria-label="Retour à l'accueil"
              >
                <img
                  src="/logo.svg"
                  alt="Guivarche Déménagement"
                  className="h-16 sm:h-24 lg:h-32 w-auto"
                />
              </button>
            </div>
            <a
              href={TUNNEL_SUPPORT_PHONE_HREF}
              className="inline-flex items-center bg-[#1c3957] text-white px-4 py-2 rounded-full no-underline hover:bg-[#2a4f6b] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CC922F] focus-visible:ring-offset-2"
              aria-label={`Appeler au ${TUNNEL_SUPPORT_PHONE_DISPLAY}`}
            >
              <Phone className="w-4 h-4 mr-2" style={{ color: '#CC922F' }} />
              <span className="text-sm font-medium">{TUNNEL_SUPPORT_PHONE_DISPLAY}</span>
              <span className="text-xs ml-2 opacity-90">Numéro non surtaxé</span>
            </a>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 px-6 py-8 sm:px-10 sm:py-12 text-center max-w-xl">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-9 h-9 sm:w-11 sm:h-11 text-emerald-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-3">
              Votre demande de devis a bien été envoyée
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mb-6">
              Merci de votre confiance. Un conseiller vous contactera très prochainement pour finaliser votre
              déménagement.
            </p>
            <Button
              className="w-full sm:w-auto bg-[#1c3957] hover:bg-[#1c3957]/90 text-white"
              onClick={() => navigate("/")}
            >
              Retour à l&apos;accueil
            </Button>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  if (
    currentPage === "quote" ||
    currentPage === "info" ||
    currentPage === "options"
  ) {
    return (
      <div className="bg-slate-50">
        {/* Header */}
        <header className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <button
                onClick={() => navigate("/")}
                className="hover:opacity-80 transition-opacity cursor-pointer"
                aria-label="Retour à l'accueil"
              >
                <img
                  src="/logo.svg"
                  alt="Guivarche Déménagement"
                  className="h-16 sm:h-24 lg:h-32 w-auto"
                />
              </button>
            </div>
            <a
              href={TUNNEL_SUPPORT_PHONE_HREF}
              className="inline-flex items-center bg-[#1c3957] text-white px-4 py-2 rounded-full no-underline hover:bg-[#2a4f6b] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CC922F] focus-visible:ring-offset-2"
              aria-label={`Appeler au ${TUNNEL_SUPPORT_PHONE_DISPLAY}`}
            >
              <Phone className="w-4 h-4 mr-2" style={{ color: '#CC922F' }} />
              <span className="text-sm font-medium">{TUNNEL_SUPPORT_PHONE_DISPLAY}</span>
              <span className="text-xs ml-2 opacity-90">Numéro non surtaxé</span>
            </a>
          </div>
        </header>

        {/* Page Content */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          {currentPage === "info" && (
            <>
              {/* Hero Illustration */}
              <div className="text-center mb-12">
                <div className="mb-8">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpbmclMjB0cnVja3xlbnwxfHx8fDE3NTY0NTM4NDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Illustration déménagement"
                    className="mx-auto max-w-md"
                  />
                </div>
                <h1 className="text-2xl font-semibold text-slate-900 mb-8 max-w-4xl mx-auto">
                  Toutes les prestations de déménagement professionnel avec guivarche Déménagement comprennent
                </h1>
              </div>

              <h2 className="sr-only">Détail des prestations incluses</h2>
              {/* Services Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-10 sm:mb-16">
                {/* Camion équipé */}
                <div className="text-center">
                  <div className="flex items-center justify-center mx-auto mb-4">
                    <Truck className="w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 font-bold" style={{ color: '#CC922F' }} />
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base text-slate-900 mb-2 sm:mb-3">
                    Camion équipé
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Un camion aux normes, avec couvertures de déménagement, des sangles et le carburant
                  </p>
                </div>

                {/* Déménageurs professionnels */}
                <div className="text-center">
                  <div className="flex items-center justify-center mx-auto mb-4">
                    <Users className="w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 font-bold" style={{ color: '#CC922F' }} />
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base text-slate-900 mb-2 sm:mb-3">
                    Déménageurs professionnels
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Une équipe dévouée et suivie, issue du réseau Guivarche déménagement
                  </p>
                </div>

                {/* Transport & remise en place */}
                <div className="text-center">
                  <div className="flex items-center justify-center mx-auto mb-4">
                    <RefreshCw className="w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 font-bold" style={{ color: '#CC922F' }} />
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base text-slate-900 mb-2 sm:mb-3">
                    Transport & remise en place
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Le chargement, le transport et la mise en place du mobilier dans la pièce de destination
                  </p>
                </div>

                {/* Service client dévoué */}
                <div className="text-center">
                  <div className="flex items-center justify-center mx-auto mb-4">
                    <Headphones className="w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 font-bold" style={{ color: '#CC922F' }} />
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base text-slate-900 mb-2 sm:mb-3">
                    Service client dévoué
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Un service client disponible 7j/7
                  </p>
                </div>
              </div>

              {/* Property Value Section */}
              <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 lg:p-8 text-center">
                <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-4 sm:mb-6">
                  Quelle est la valeur des biens transportés ?
                </h2>

                <div className="max-w-2xl mx-auto">
                  <div className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 sm:mb-8">
                    {propertyValue.toLocaleString("fr-FR")} €
                  </div>

                  {/* Custom Slider */}
                  <div className="mb-6">
                    <Slider
                      value={[propertyValue]}
                      onValueChange={(value) => setPropertyValue(value[0])}
                      max={60000}
                      min={3000}
                      step={1000}
                      className="w-full"
                    />
                  </div>

                  <div className="flex justify-between text-sm text-slate-600">
                    <span>3000€</span>
                    <span>60000€</span>
                  </div>
                </div>
              </div>

              {/* Back Button and Continue */}
              <div className="mt-8 flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={handleBackToQuote}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" style={{ color: '#CC922F' }} />
                  RETOUR
                </Button>

                <Button
                  onClick={handleContinueToOptions}
                  className="bg-[#1c3957] hover:bg-[#1c3957]/90 text-white px-8"
                >
                  CONTINUER →
                </Button>
              </div>
            </>
          )}

          {currentPage === "options" && (
            <>
              <h1 className="sr-only">Options de votre déménagement</h1>
              {/* Guarantee Section */}
              <div className="bg-slate-100 rounded-lg p-4 sm:p-6 lg:p-8 text-center mb-8 sm:mb-12">
                <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-3 sm:mb-4">
                  Votre garantie par objet
                </h2>
                <p className="text-sm text-slate-600 mb-6 sm:mb-8 max-w-4xl mx-auto">
                  Indiquez ici le montant maximal de garantie par élément transporté. Si cela ne suffit pas,
                  vous pourrez faire une{" "}
                  <span className="underline text-primary cursor-pointer">
                    déclaration de valeur
                  </span>
                  .
                </p>

                <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                  {[
                    { value: "250", label: "250 €" },
                    { value: "500", label: "500 €" },
                    { value: "1000", label: "1000 €" },
                  ].map((guarantee) => (
                    <Button
                      key={guarantee.value}
                      variant={selectedGuarantee === guarantee.value ? "default" : "outline"}
                      onClick={() => setSelectedGuarantee(guarantee.value)}
                      className={`px-6 sm:px-8 py-3 ${selectedGuarantee === guarantee.value
                        ? "bg-[#CC922F] text-white"
                        : "bg-white text-slate-900 border-slate-300"
                        }`}
                    >
                      {guarantee.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Options Section */}
              <div className="mb-8 sm:mb-12">
                <h2 className="text-lg sm:text-xl font-semibold text-slate-900 text-center mb-6 sm:mb-8">
                  Choisissez vos options
                </h2>

                <div className="space-y-4 sm:space-y-6">
                  {/* Démontage/remontage (option 3 - payante) */}
                  <div className="flex items-start gap-4 py-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Scissors className="w-6 h-6" style={{ color: '#CC922F' }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-900 mb-1">
                        Vous souhaitez qu'on s'occupe du démontage et du remontage du mobilier
                        quand c'est nécessaire ?
                      </h3>
                    </div>
                    <Switch
                      checked={options.demontageRemontage}
                      onCheckedChange={() => toggleOption("demontageRemontage")}
                    />
                  </div>

                  {/* Emballage fragile (option 4 - payante) */}
                  <div className="flex items-start gap-4 py-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6" style={{ color: '#CC922F' }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-900 mb-1">
                        Vous préférez nous confier l'emballage du fragile (vaisselles, tableaux,
                        bibelots) ?
                      </h3>
                    </div>
                    <Switch
                      checked={options.emballageFragile}
                      onCheckedChange={() => toggleOption("emballageFragile")}
                    />
                  </div>

                  {/* Emballage cartons (option 5 - payante) */}
                  <div className="flex items-start gap-4 py-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package className="w-6 h-6" style={{ color: '#CC922F' }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-900 mb-1">
                        Vous souhaitez qu'on emballe les cartons déclarés dans l'inventaire ?
                      </h3>
                    </div>
                    <Switch
                      checked={options.emballageCartons}
                      onCheckedChange={() => toggleOption("emballageCartons")}
                    />
                  </div>
                </div>
              </div>

              {/* Final Quote Section */}
              <div className="text-center mb-8">
                <p className="text-sm text-slate-600 mb-6">
                  Valider ma demande avec les options sélectionnées et passer au récapitulatif
                </p>

                <Button
                  onClick={handleSubmitOptions}
                  className="bg-[#1c3957] hover:bg-[#1c3957]/90 text-white px-12 py-3 rounded-lg"
                >
                  DEMANDER MON DEVIS
                </Button>
              </div>

              {/* Back Button */}
              <div className="mt-8">
                <Button
                  variant="outline"
                  onClick={handleBackToInfo}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" style={{ color: '#CC922F' }} />
                  RETOUR
                </Button>
              </div>
            </>
          )}

          {currentPage === "quote" && (
            <>
              <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 md:divide-x md:divide-slate-200">
                  {/* Left half */}
                  <div className="space-y-4">
                    <div className="text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start mb-3">
                        <Truck className="w-12 h-12 sm:w-16 sm:h-16 font-bold" style={{ color: '#CC922F' }} />
                      </div>
                      <h1 className="text-xl font-bold text-slate-900 mb-1">
                        Devis personnalisé
                      </h1>
                      <div className="text-sm text-slate-600">
                        Un conseiller vous recontactera par e-mail ou par téléphone avec votre devis détaillé
                      </div>
                    </div>

                    <div className="space-y-3 text-sm border-t border-slate-100 pt-4">
                      <div className="text-xs text-slate-500 mb-2">
                        <span className="font-medium text-slate-700">{addressData.departure.address}</span>
                        <span className="mx-1">→</span>
                        <span className="font-medium text-slate-700">{addressData.arrival.address}</span>
                      </div>
                      <p className="text-xs text-slate-500">Sélectionnez vos options ci-dessous puis cliquez sur &quot;Demander mon devis&quot; pour recevoir le récapitulatif par e-mail et être recontacté.</p>
                    </div>

                    <div className="space-y-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Date</span>
                        <span className="font-medium">mar. 02/09/2025</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Volume déclaré</span>
                        <span className="font-medium">
                          {declaredVolumeM3 != null && !Number.isNaN(declaredVolumeM3)
                            ? `${Number(declaredVolumeM3).toFixed(1)} m³${declaredVolumeMethod ? ` (calculé par ${declaredVolumeMethod === 'list' ? 'inventaire' : declaredVolumeMethod === 'surface' ? 'superficie' : 'photo/IA'})` : ''}`
                            : '(calculé par inventaire)'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Distance</span>
                        <span className="font-medium">
                          {distanceLoading ? "Calcul…" : distanceText || (distanceKm != null ? `${distanceKm} km` : "—")}
                        </span>
                      </div>
                      <div className="pt-4 border-t border-slate-200">
                        <div className="font-medium text-slate-900 mb-3">Départ</div>
                        <div className="flex justify-between mb-2">
                          <span className="text-slate-600">Adresse</span>
                          <span className="font-medium text-right max-w-[140px] sm:max-w-[180px] truncate block">
                            {addressData.departure.address}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Étage</span>
                          <span className="font-medium">{addressData.departure.floor}</span>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-slate-200">
                        <div className="font-medium text-slate-900 mb-3">Arrivée</div>
                        <div className="flex justify-between mb-2">
                          <span className="text-slate-600">Adresse</span>
                          <span className="font-medium text-right max-w-[140px] sm:max-w-[180px] truncate block">
                            {addressData.arrival.address}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Étage</span>
                          <span className="font-medium">{addressData.arrival.floor}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right half - "Services inclus" on same line as "Devis personnalisé" */}
                  <div className="flex flex-col justify-center md:pl-6 space-y-4">
                    <div className="border-t border-slate-200 pt-4 md:border-t-0 md:pt-0 md:pt-[3.75rem]">
                      <div className="font-medium text-slate-900 mb-3">Prestations incluses</div>
                      <div className="space-y-2">
                        <div className="flex items-center text-xs text-slate-600">
                          <Check className="w-3 h-3 mr-2" style={{ color: '#CC922F' }} />
                          Chargement - Transport, mise en place du Mobilier
                        </div>
                        <div className="flex items-center text-xs text-slate-600">
                          <Check className="w-3 h-3 mr-2" style={{ color: '#CC922F' }} />
                          protection du mobilier sous couvertures

                        </div>
                        <div className="flex items-center text-xs text-slate-600">
                          <Check className="w-3 h-3 mr-2" style={{ color: '#CC922F' }} />
                          Protection de la literie sous housses
                        </div>
                        <div className="flex items-center text-xs text-slate-600">
                          <Check className="w-3 h-3 mr-2" style={{ color: '#CC922F' }} />
                          Protection de la HI-FI et de l'électronique

                        </div>
                        <div className="flex items-center text-xs text-slate-600">
                          <Check className="w-3 h-3 mr-2" style={{ color: '#CC922F' }} />
                          Emballage des vêtements sur cintres en penderies
                        </div>
                        <div className="flex items-center text-xs text-slate-600">
                          <Check className="w-3 h-3 mr-2" style={{ color: '#CC922F' }} />
                          Débranchement et branchement de l'électroménager
                          </div>
                          <div className="flex items-center text-xs text-slate-600">
                          <Check className="w-3 h-3 mr-2" style={{ color: '#CC922F' }} />
                          Protection des éléments fragiles
                          </div>
                        {/* Options 1, 2, 6, 7 → toujours incluses par défaut */}
                        <div className="flex items-center text-xs text-slate-600">
                          <Check className="w-3 h-3 mr-2" style={{ color: '#CC922F' }} />
                          Pack cartons, bulle et adhésif (expédié sous 48h)
                        </div>
                        <div className="flex items-center text-xs text-slate-600">
                          <Check className="w-3 h-3 mr-2" style={{ color: '#CC922F' }} />
                          Prix flexible (flexible sur 5 jours)
                        </div>
                        <div className="flex items-center text-xs text-slate-600">
                          <Check className="w-3 h-3 mr-2" style={{ color: '#CC922F' }} />
                          Démarches autorisation de stationnement (sous conditions)
                        </div>
                        <div className="flex items-center text-xs text-slate-600">
                          <Check className="w-3 h-3 mr-2" style={{ color: '#CC922F' }} />
                          Transport des vêtements sur cintres (pendery)
                        </div>
                      </div>

                      {/* Prestations extra - options 3, 4, 5 (payantes) quand sélectionnées */}
                      {(options.demontageRemontage || options.emballageFragile || options.emballageCartons) && (
                        <div className="mt-4 pt-4 border-t border-slate-100">
                          <div className="font-medium text-slate-900 mb-3">Prestations en extra</div>
                          <div className="space-y-2">
                            {options.demontageRemontage && (
                              <div className="flex items-center text-xs text-slate-600">
                                <Check className="w-3 h-3 mr-2" style={{ color: '#CC922F' }} />
                                Démontage et remontage du mobilier
                              </div>
                            )}
                            {options.emballageFragile && (
                              <div className="flex items-center text-xs text-slate-600">
                                <Check className="w-3 h-3 mr-2" style={{ color: '#CC922F' }} />
                                Emballage du fragile (vaisselle, tableaux, bibelots)
                              </div>
                            )}
                            {options.emballageCartons && (
                              <div className="flex items-center text-xs text-slate-600">
                                <Check className="w-3 h-3 mr-2" style={{ color: '#CC922F' }} />
                                Emballage des cartons de l'inventaire
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Personal info fields (collected here at last step) */}
                    <div className="space-y-4 border-t border-slate-200 pt-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="quote-name" className="text-slate-900 mb-2 block text-sm">Nom</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#CC922F' }} />
                            <Input
                              id="quote-name"
                              type="text"
                              placeholder="Nom de famille"
                              value={formData.name}
                              onChange={(e) => handleInputChange("name", e.target.value)}
                              className="pl-10 bg-slate-50 border-slate-200"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="quote-firstName" className="text-slate-900 mb-2 block text-sm">Prénom</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#CC922F' }} />
                            <Input
                              id="quote-firstName"
                              type="text"
                              placeholder="Prénom"
                              value={formData.firstName}
                              onChange={(e) => handleInputChange("firstName", e.target.value)}
                              className="pl-10 bg-slate-50 border-slate-200"
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="quote-email" className="text-slate-900 mb-2 block text-sm">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#CC922F' }} />
                          <Input
                            id="quote-email"
                            type="email"
                            placeholder="Adresse email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            className="pl-10 bg-slate-50 border-slate-200"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="quote-phone" className="text-slate-900 mb-2 block text-sm">Téléphone</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#CC922F' }} />
                          <Input
                            id="quote-phone"
                            type="tel"
                            placeholder="Numéro de téléphone"
                            value={formData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            className="pl-10 bg-slate-50 border-slate-200"
                          />
                        </div>
                      </div>
                      <p className="text-xs text-primary leading-relaxed">
                        En soumettant ce formulaire, j'accepte d'être contacté par Guivarche et ses
                        partenaires pour l'organisation de mon service de déménagement.
                      </p>
                    </div>

                    {devisSent ? (
                      <div className="w-full bg-green-600 text-white py-3 rounded-lg text-center font-medium flex items-center justify-center gap-2">
                        <Check className="w-5 h-5" />
                        Récapitulatif envoyé par e-mail !
                      </div>
                    ) : (
                      <Button
                        className="w-full bg-[#1c3957] hover:bg-[#1c3957]/90 text-white py-3"
                        onClick={handleSendDevis}
                        disabled={sendingDevis || !formData.name.trim() || !formData.firstName.trim() || !formData.email.trim() || !formData.phone.trim()}
                      >
                        {sendingDevis ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Envoi en cours...
                          </span>
                        ) : 'DEMANDER MON DEVIS'}
                      </Button>
                    )}

                    <div className="space-y-3 text-sm border-t border-slate-100 pt-4 pb-2">
                      <div className="flex items-center">
                        <Heart className="w-4 h-4 mr-2 flex-shrink-0" style={{ color: '#CC922F' }} />
                        <span className="text-slate-700">+100 000 clients satisfaits depuis 2011</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2 flex-shrink-0" style={{ color: '#CC922F' }} />
                        <span className="text-slate-700">Déménageurs professionnels suivis</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2 flex-shrink-0" style={{ color: '#CC922F' }} />
                        <span className="text-slate-700">Service client 7j/7 de 9h à 18h</span>
                      </div>
                    </div>

                    <Button
                      variant="link"
                      className="w-full text-slate-600 text-sm p-0"
                      onClick={() => {
                        const element = document.getElementById('options-section');
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                    >
                      Personnaliser et voir ce qui est inclus
                    </Button>
                  </div>
                </div>
              </div>

              {/* Back Button */}
              <div className="mt-8 flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={handleBackToAddresses}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" style={{ color: '#CC922F' }} />
                  RETOUR
                </Button>

                {/* Gold Down Arrow */}
                <div
                  className="w-10 h-10 bg-[#CC922F] rounded-full flex items-center justify-center hover:bg-[#CC922F]/90 transition-colors cursor-pointer"
                  onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
                >
                  <ArrowDown className="w-5 h-5 text-white" />
                </div>
              </div>

              {/* Options Section */}
              <div id="options-section" className="mb-8 sm:mb-12">
                <h2 className="text-[2.75rem] leading-tight font-semibold text-slate-900 text-center mb-6 sm:mb-8">
                  Choisissez vos options
                </h2>

                <div className="border border-slate-200 rounded-xl bg-white shadow-sm p-4 sm:p-6">
                  <div className="space-y-4 sm:space-y-6">
                    {/* Option 3: Démontage Remontage (payante) */}
                    <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Scissors className="w-6 h-6" style={{ color: '#CC922F' }} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-slate-700 leading-relaxed">
                          Vous souhaitez qu'on s'occupe du démontage et du remontage du mobilier quand c'est nécessaire?
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={options.demontageRemontage}
                            onChange={(e) => setOptions(prev => ({ ...prev, demontageRemontage: e.target.checked }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1c3957]"></div>
                        </label>
                      </div>
                    </div>

                    {/* Option 4: Emballage Fragile (payante) */}
                    <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Package className="w-6 h-6" style={{ color: '#CC922F' }} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-slate-700 leading-relaxed">
                          Vous préférez nous confier l'emballage du fragile (vaisselles, tableaux, bibelots)?
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={options.emballageFragile}
                            onChange={(e) => {
                              setOptions(prev => ({ 
                                ...prev, 
                                emballageFragile: e.target.checked,
                                emballageCartons: e.target.checked ? false : prev.emballageCartons
                              }))
                            }}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1c3957]"></div>
                        </label>
                      </div>
                    </div>

                    {/* Option 5: Emballage Cartons (payante) */}
                    <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Package className="w-6 h-6" style={{ color: '#CC922F' }} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-slate-700 leading-relaxed">
                          Vous souhaitez qu'on emballe les cartons déclarés dans l'inventaire ?
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={options.emballageCartons}
                            onChange={(e) => {
                              setOptions(prev => ({ 
                                ...prev, 
                                emballageCartons: e.target.checked,
                                emballageFragile: e.target.checked ? false : prev.emballageFragile
                              }))
                            }}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1c3957]"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Info Section */}
              <div className="mt-8">

                <div className="text-center mb-12">
                  <h2 className="text-2xl font-semibold text-slate-900 mb-8 max-w-4xl mx-auto">
                    Toutes les prestations de déménagement professionnel avec Guivarche Déménagement comprennent
                  </h2>
                </div>

                {/* Services Grid */}
                <div className="grid md:grid-cols-4 gap-8 mb-16">
                  {/* Camion équipé */}
                  <div className="text-center">
                    <div className="flex items-center justify-center mx-auto mb-4">
                      <Truck className="w-16 h-16 font-bold" style={{ color: '#CC922F' }} />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-3">
                      Camion équipé
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Un camion aux normes, avec couvertures de déménagement, des sangles et le carburant
                    </p>
                  </div>

                  {/* Déménageurs professionnels */}
                  <div className="text-center">
                    <div className="flex items-center justify-center mx-auto mb-4">
                      <Users className="w-16 h-16 font-bold" style={{ color: '#CC922F' }} />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-3">
                      Déménageurs professionnels
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Une équipe dévouée et suivie, issue du réseau Guivarche Déménagement
                    </p>
                  </div>

                  {/* Transport & remise en place */}
                  <div className="text-center">
                    <div className="flex items-center justify-center mx-auto mb-4">
                      <RefreshCw className="w-16 h-16 font-bold" style={{ color: '#CC922F' }} />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-3">
                      Transport & remise en place
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Le chargement, le transport et la mise en place du mobilier dans la pièce de destination
                    </p>
                  </div>

                  {/* Service client dévoué */}
                  <div className="text-center">
                    <div className="flex items-center justify-center mx-auto mb-4">
                      <Headphones className="w-16 h-16 font-bold" style={{ color: '#CC922F' }} />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-3">
                      Service client dévoué
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Un service client disponible 7j/7
                    </p>
                  </div>
                </div>

                
                
              </div>


              {/* PDF (hors écran — nécessaire pour l’export e-mail ; plus affiché sous la grille des prestations) */}
              <div
                className="fixed left-[-9999px] top-0 z-0 w-[210mm] max-w-[100vw] pointer-events-none"
                aria-hidden="true"
              >
                <PDFReport
                  ref={pdfReportRef}
                  clientData={{
                    nom: formData.name || '',
                    prenom: formData.firstName || '',
                    email: formData.email || '',
                    telephone: formData.phone || '',
                    date_demenagement: formData.date || ''
                  }}
                  methodData={{
                    method: lastUsedMethod || selectedMethod || 'list',
                    volume_m3: declaredVolumeM3 != null && !Number.isNaN(declaredVolumeM3) ? declaredVolumeM3 : undefined,
                    surface_area: selectedMethod === 'surface' ? parseFloat(surfaceArea) : undefined,
                    roomObjectQuantities: roomObjectQuantities,
                    uploadedImages: uploadedImages,
                    roomAnalysisResults: roomAnalysisResults,
                    specialObjectQuantities: specialObjectQuantities
                  }}
                  quoteData={{
                    final_price: 0,
                    base_price_transport: undefined,
                    volume_m3: declaredVolumeM3 != null && !Number.isNaN(declaredVolumeM3) ? declaredVolumeM3 : undefined,
                    distance_km: distanceKm != null ? distanceKm : undefined,
                    etage_total: undefined,
                    ascenseur_total: undefined,
                    demi_etage_total: undefined,
                    escale_total: undefined,
                    portage_total: undefined
                  }}
                  addressData={{
                    departure: {
                      address: addressData.departure.address,
                      floor: addressData.departure.floor,
                      elevator: addressData.departure.elevator === "Oui",
                      options: { portageDistanceM: addressData.departure.options.portageDistanceM }
                    },
                    arrival: {
                      address: addressData.arrival.address,
                      floor: addressData.arrival.floor,
                      elevator: addressData.arrival.elevator === "Oui",
                      options: { portageDistanceM: addressData.arrival.options.portageDistanceM }
                    }
                  }}
                  optionsData={{
                    demontageRemontage: options.demontageRemontage,
                    emballageFragile: options.emballageFragile,
                    emballageCartons: options.emballageCartons,
                    packCartons: options.packCartons,
                    dateFlexible: options.dateFlexible,
                    prixFlexible: options.prixFlexible,
                    autorisationStationnement: options.autorisationStationnement,
                    transportVetements: options.transportVetements,
                    assurance: 0,
                    cleaningQuantities: cleaningQuantities
                  }}
                  propertyValue={0}
                />
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center min-w-0">
            <button
              onClick={() => navigate("/")}
              className="flex-shrink-0 hover:opacity-80 transition-opacity cursor-pointer"
              aria-label="Accueil"
            >
              <img
                src="/logo.svg"
                alt="Guivarche Déménagement"
                className="h-16 sm:h-24 lg:h-32 w-auto"
              />
            </button>
            <p className="text-xs sm:text-base text-slate-600 ml-2 sm:ml-3 hidden sm:block">
              Déménagement professionnel pour tous
            </p>
          </div>
          <a
            href={TUNNEL_SUPPORT_PHONE_HREF}
            className="inline-flex items-center bg-[#1c3957] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full flex-shrink-0 no-underline hover:bg-[#2a4f6b] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CC922F] focus-visible:ring-offset-2"
            aria-label={`Appeler au ${TUNNEL_SUPPORT_PHONE_DISPLAY}`}
          >
            <Phone className="w-5 h-5 mr-2" style={{ color: '#CC922F' }} />
            <span className="text-sm sm:text-base font-medium">{TUNNEL_SUPPORT_PHONE_DISPLAY}</span>
            <span className="text-xs sm:text-sm ml-1 sm:ml-2 opacity-90 hidden sm:inline">
              Numéro non surtaxé
            </span>
          </a>
        </div>
      </header>

      <div className="max-w-8xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 min-w-0">
            <div className="bg-slate-50 rounded-lg shadow-sm p-4 sm:p-6 lg:p-8">
              {currentPage === "form" && (
                <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-6 sm:mb-8">
                  Votre devis de déménagement
                </h1>
              )}
              {currentPage === "methods" && (
                <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-6 sm:mb-8">
                  Choisissez votre méthode d&apos;estimation
                </h1>
              )}
              {currentPage !== "form" && currentPage !== "methods" && (
                <h1 className="sr-only">Demande de devis de déménagement — Guivarche</h1>
              )}
              {/* Mobile progress */}
              <div className="lg:hidden mb-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <h2 className="text-sm font-semibold text-slate-900">Mes étapes</h2>
                  <span className="text-xs font-medium text-slate-600">Étape {currentStepNumber}/3</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-200 mb-3">
                  <div
                    className="h-2 rounded-full bg-[#1c3957] transition-all duration-300"
                    style={{ width: `${(currentStepNumber / 3) * 100}%` }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {stepItems.map((item) => {
                    const isCompleted = currentStepNumber > item.step;
                    const isCurrent = currentStepNumber === item.step;
                    const badgeClass = isCompleted
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : isCurrent
                        ? "bg-white border-[#1c3957] text-[#1c3957]"
                        : "bg-white border-slate-300 text-slate-400";
                    const cardClass = isCurrent
                      ? "border-[#1c3957] bg-[#1c3957]/5"
                      : "border-slate-200 bg-white";

                    return (
                      <div key={item.step} className={`rounded-lg border p-2.5 ${cardClass}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`flex h-5 w-5 items-center justify-center rounded-full border text-[10px] font-semibold ${badgeClass}`}>
                            {isCompleted ? <Check className="w-3 h-3" /> : item.step}
                          </div>
                          <p className="text-xs font-semibold text-slate-800 truncate">Étape {item.step}</p>
                        </div>
                        <p className="text-[11px] text-slate-600 truncate">{item.title}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {currentPage === "form" && (
                <div>
                  {/* Sophie's Profile */}
                  <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5 mb-8 sm:mb-10">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden flex-shrink-0">
                      <ImageWithFallback
                        src="/sophie.jpeg"
                        alt="Sophie"
                        className="w-full h-full object-cover"
                        style={{ transform: 'scale(1.2)' }}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">
                        Sophie
                      </p>
                      <p className="text-primary text-sm sm:text-base mb-3">
                        Bonjour ! Je suis Sophie.
                      </p>
                      <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                        En quelques questions, je vais vous trouver le service de déménagement qui vous convient au meilleur prix.
                      </p>
                    </div>
                  </div>

                  {/* Form */}
                  <div className="space-y-8">
                    <div>
                      <Label
                        htmlFor="address"
                        className="text-slate-900 mb-3 block text-base font-medium"
                      >
                        Mon service de déménagement
                      </Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 z-10 pointer-events-none" style={{ color: '#CC922F' }} />
                        <AddressAutocomplete
                          value={formData.address}
                          onChange={(v) => handleInputChange("address", v)}
                          placeholder="Quelle est votre adresse ?"
                          className="pl-12 bg-slate-50 border-slate-200 h-12 text-base"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label
                          htmlFor="date"
                          className="text-slate-900 mb-2 block"
                        >
                          Date de déménagement préférée
                        </Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none z-10" style={{ color: '#CC922F' }} />
                          <Input
                            id="date"
                            type="date"
                            min={getLocalDateString()}
                            value={formData.date}
                            onChange={(e) =>
                              handleInputChange("date", e.target.value)
                            }
                            className="pl-10 bg-slate-50 border-slate-200 cursor-pointer"
                            style={{ colorScheme: 'light' }}
                          />
                        </div>
                      </div>
                      <div className="hidden md:block" aria-hidden="true" />
                    </div>

                    <p className="text-xs text-primary leading-relaxed">
                      En soumettant ce formulaire, j'accepte d'être contacté par Guivarche et ses
                      partenaires pour l'organisation de mon service de déménagement.
                    </p>

                    <Button
                      className="w-full bg-[#1c3957] hover:bg-[#1c3957]/90 text-white py-3 rounded-lg font-medium"
                      size="lg"
                      onClick={handleSubmitForm}
                    >
                      CONTINUER →
                    </Button>
                  </div>
                </div>
              )}

              {currentPage === "methods" && (
                <>
                  {/* Sophie's Profile - Methods Page */}
                  <div className="flex flex-col sm:flex-row items-start gap-4 mb-6 sm:mb-8">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden flex-shrink-0">
                      <ImageWithFallback
                        src="/sophie.jpeg"
                        alt="Sophie"
                        className="w-full h-full object-cover"
                        style={{ transform: 'scale(1.2)' }}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-lg font-semibold text-slate-900 mb-1">
                        Sophie
                      </p>
                      <p className="text-primary text-sm mb-2">
                        Parfait ! On est à quelques clics de votre devis.
                      </p>
                    </div>
                  </div>

                  {/* Method Selection */}
                  <div className="space-y-4 sm:space-y-6">
                    {/* Primary default method: Surface Area Based Quote */}
                    <div
                      className="border-2 border-[#1c3957] rounded-lg p-7 sm:p-8 cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 bg-slate-50/50"
                      onClick={() => handleSelectMethod("surface")}
                    >
                      <div className="flex flex-col items-center text-center space-y-4 sm:space-y-5">
                        <div className="inline-flex items-center gap-2 rounded-full bg-[#1c3957] px-3 py-1 text-xs font-semibold text-white">
                          Recommandé par défaut
                        </div>
                        <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                          <Maximize2 className="w-10 h-10" style={{ color: '#CC922F' }} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 text-xl sm:text-2xl mb-2">
                            Mon devis en fonction de la superficie
                          </h3>
                          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
                            Obtenez une estimation rapide basée sur la surface totale de votre logement.
                          </p>
                        </div>
                        <ChevronRight className="w-7 h-7" style={{ color: '#CC922F' }} />
                      </div>
                    </div>

                    {/* Secondary methods */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      {/* Method 1: List Cleaning Tasks */}
                      <div
                        className="border-2 border-slate-200 rounded-lg p-6 hover:border-[#1c3957] cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
                        onClick={() => handleSelectMethod("list")}
                      >
                        <div className="flex flex-col items-center text-center space-y-4">
                          <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center">
                            <List className="w-8 h-8" style={{ color: '#CC922F' }} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900 text-lg mb-2">
                              Je liste mes objets à déménager
                            </h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                              Préciser quelles pièces et objets vous souhaitez déménager.
                            </p>
                          </div>
                          <ChevronRight className="w-6 h-6" style={{ color: '#CC922F' }} />
                        </div>
                      </div>

                      {/* Method 2: AI Photo Detection */}
                      <div
                        className="border-2 border-slate-200 rounded-lg p-6 hover:border-[#1c3957] cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
                        onClick={() => handleSelectMethod("photo")}
                      >
                        <div className="flex flex-col items-center text-center space-y-4">
                          <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center relative">
                            <Camera className="w-8 h-8" style={{ color: '#CC922F' }} />
                            <div className="absolute -top-2 -right-2 bg-[#1c3957] text-white text-xs px-2 py-1 rounded-full font-semibold">
                              IA
                            </div>
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900 text-lg mb-2">
                              J'envoie des photos de mon espace
                            </h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                              Notre IA évaluera automatiquement le volume de votre déménagement.
                            </p>
                          </div>
                          <ChevronRight className="w-6 h-6" style={{ color: '#CC922F' }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Back Button */}
                  <div className="mt-8 lg:col-span-3">
                    <Button
                      variant="outline"
                      onClick={handleBackToForm}
                      className="flex items-center gap-2 bg-[#1c3957] hover:bg-[#1c3957]/90 text-white hover:text-white border-[#1c3957]"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      RETOUR
                    </Button>
                  </div>
                </>
              )}

              {currentPage === "volume" && selectedMethod === "list" && (
                <>
                  {/* Sophie's Profile - Cleaning Page */}
                  <div className="flex flex-col sm:flex-row items-start gap-4 mb-6">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden flex-shrink-0">
                      <ImageWithFallback
                        src="/sophie.jpeg"
                        alt="Sophie"
                        className="w-full h-full object-cover"
                        style={{ transform: 'scale(1.2)' }}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-lg font-semibold text-slate-900 mb-1">
                        Sophie
                      </p>
                      <p className="text-primary text-sm">
                        Parfait ! Précisez pièce par pièce les objets à déménager dont vous avez besoin.
                      </p>
                    </div>
                  </div>

                  {/* Room Navigation */}
                  <div className="flex items-center justify-center mb-4 sm:mb-6 overflow-x-auto">
                    <div className="flex items-center bg-slate-100 rounded-full px-3 sm:px-6 py-3 gap-2 sm:gap-6 min-w-0">
                      {/* Left Arrow Button */}
                      <button
                        onClick={handlePreviousRoomPage}
                        disabled={currentRoomIndex === 0}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                      </button>

                      {/* Room Buttons */}
                      <div className="flex gap-2 flex-shrink-0">
                        {getVisibleRooms().map((room) => (
                          <button
                            key={room}
                            onClick={() => setSelectedRoom(room)}
                            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm sm:text-base font-medium transition-colors whitespace-nowrap ${selectedRoom === room
                              ? 'bg-[#1c3957] text-white shadow-md'
                              : 'text-slate-600 hover:bg-slate-200'
                              }`}
                          >
                            {room}
                          </button>
                        ))}
                      </div>

                      {/* Right Arrow Button */}
                      <button
                        onClick={handleNextRoomPage}
                        disabled={currentRoomIndex >= rooms.length - 5}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronRight className="w-5 h-5 text-slate-600" />
                      </button>
                    </div>
                  </div>

                  {/* Search Bar */}
                  <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: '#CC922F' }} />
                    <Input
                      type="text"
                      placeholder="Chercher dans la liste complète..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-slate-50 border-slate-200"
                    />
                  </div>

                  {/* Moving Items Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    {movingItems.map((item) => {
                      const roomQuantity = roomObjectQuantities[selectedRoom]?.[item.name] || 0;
                      const hasQuantity = roomQuantity > 0;
                      return (
                        <div
                          key={item.name}
                          className={`rounded-lg p-4 text-center relative transition-colors ${hasQuantity
                            ? 'bg-slate-50 border-2 shadow-md'
                            : 'bg-slate-50'
                            }`}
                          style={hasQuantity ? { borderColor: '#1c3957' } : {}}
                        >
                          {/* Delete icon for custom objects */}
                          {isCustomObject(item.name) && (
                            <div
                              className="absolute top-2 right-2 cursor-pointer hover:scale-110 transition-transform"
                              title="Supprimer cet objet personnalisé"
                              onClick={() => deleteCustomObject(item.name)}
                            >
                              <Trash2
                                className="w-4 h-4"
                                style={{ color: '#CC922F' }}
                              />
                            </div>
                          )}

                          <div className="flex justify-center mb-2">{item.icon}</div>
                          <h3 className="text-sm font-medium text-slate-900 mb-3">
                            {item.name}
                            {isCustomObject(item.name) && (
                              <span className="text-xs ml-1" style={{ color: '#CC922F' }}>(Personnalisé)</span>
                            )}
                          </h3>
                          <div className="flex items-center justify-center gap-3">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.name, -1)}
                              disabled={!roomQuantity}
                              className="w-8 h-8 p-0"
                            >
                              <Minus className="w-4 h-4" style={{ color: '#CC922F' }} />
                            </Button>
                            <span className="text-lg font-medium min-w-[2rem] text-center">
                              {roomQuantity}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.name, 1)}
                              className="w-8 h-8 p-0"
                            >
                              <Plus className="w-4 h-4" style={{ color: '#CC922F' }} />
                            </Button>
                          </div>
                        </div>
                      );
                    })}

                    {/* Add Other Services */}
                    <div className="bg-slate-50 rounded-lg p-4 text-center">
                      <div className="flex items-center justify-center mx-auto mb-2">
                        <Plus className="w-10 h-10 font-bold" style={{ color: '#CC922F' }} />
                      </div>
                      <h3 className="text-sm font-medium text-slate-900 mb-3">
                        Ajouter un objet
                      </h3>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        onClick={() => setShowAddPieceForm(!showAddPieceForm)}
                      >
                        Ajouter
                      </Button>
                    </div>
                  </div>

                  {/* Add Piece Form */}
                  {showAddPieceForm && (
                    <div className="max-w-4xl mx-auto mb-8">
                      <div className="bg-white border border-slate-200 rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold text-slate-900">Ajouter un objet</h3>
                          <Button
                            size="sm"
                            onClick={() => setShowAddPieceForm(false)}
                            className="bg-[#1c3957] hover:bg-[#1c3957]/90 text-white"
                          >
                            Fermer
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Nature de l'objet and Quantité */}
                          <div className="space-y-2">
                            <Label htmlFor="nature" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                              <Tag className="w-4 h-4" style={{ color: '#CC922F' }} />
                              Nature de l'objet
                            </Label>
                            <Input
                              id="nature"
                              type="text"
                              placeholder="Ex: Table, Chaise, Armoire..."
                              value={pieceForm.nature}
                              onChange={(e) => setPieceForm(prev => ({ ...prev, nature: e.target.value }))}
                              className="w-full"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="quantite" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                              <Hash className="w-4 h-4" style={{ color: '#CC922F' }} />
                              Quantité
                            </Label>
                            <Input
                              id="quantite"
                              type="number"
                              placeholder="Ex: 2"
                              value={pieceForm.quantite}
                              onChange={(e) => setPieceForm(prev => ({ ...prev, quantite: e.target.value }))}
                              className="w-full"
                              min="1"
                            />
                          </div>

                          {/* Dimensions */}
                          <div className="space-y-2">
                            <Label htmlFor="longueur" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                              <Ruler className="w-4 h-4" style={{ color: '#CC922F' }} />
                              Longueur (cm)
                            </Label>
                            <Input
                              id="longueur"
                              type="number"
                              placeholder="Ex: 120"
                              value={pieceForm.longueur}
                              onChange={(e) => setPieceForm(prev => ({ ...prev, longueur: e.target.value }))}
                              className="w-full"
                              min="0"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="largeur" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                              <Ruler className="w-4 h-4" style={{ color: '#CC922F' }} />
                              Largeur (cm)
                            </Label>
                            <Input
                              id="largeur"
                              type="number"
                              placeholder="Ex: 80"
                              value={pieceForm.largeur}
                              onChange={(e) => setPieceForm(prev => ({ ...prev, largeur: e.target.value }))}
                              className="w-full"
                              min="0"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="hauteur" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                              <Ruler className="w-4 h-4" style={{ color: '#CC922F' }} />
                              Hauteur (cm)
                            </Label>
                            <Input
                              id="hauteur"
                              type="number"
                              placeholder="Ex: 75"
                              value={pieceForm.hauteur}
                              onChange={(e) => setPieceForm(prev => ({ ...prev, hauteur: e.target.value }))}
                              className="w-full"
                              min="0"
                            />
                          </div>

                          {/* Ajouter Button */}
                          <div className="flex items-end">
                            <Button
                              onClick={handleAddPiece}
                              className="w-full bg-[#1c3957] hover:bg-[#1c3957]/90 text-white"
                              disabled={!pieceForm.nature.trim() || !pieceForm.quantite.trim()}
                            >
                              Ajouter
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Special Objects Question */}
                  <div className="max-w-4xl mx-auto mb-8">
                    <div className="bg-slate-50 rounded-lg p-6">
                      <div className="mb-4">
                        <div className="flex items-center mb-2">
                          <h3 className="text-lg font-semibold text-slate-900">
                            Avez-vous des objets particuliers ou de + de 80kgs à déménager ?
                          </h3>
                          <button
                            onClick={handleSpecialObjectsToggle}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ml-2 ${hasSpecialObjects ? 'bg-[#1c3957]' : 'bg-slate-300'
                              }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${hasSpecialObjects ? 'translate-x-6' : 'translate-x-1'
                                }`}
                            />
                          </button>
                        </div>
                        <p className="text-sm text-slate-600">
                          Sélectionnez les objets lourds qui nécessitent une attention particulière
                        </p>
                      </div>

                      {/* Special Objects Grid */}
                      {hasSpecialObjects && (
                        <div className="mt-6">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {specialObjects.map((object) => {
                              const hasQuantity = specialObjectQuantities[object] && specialObjectQuantities[object] > 0;
                              // Check if this is a custom object
                              const isCustomObject = customHeavyObjects.includes(object);

                              return (
                                <div
                                  key={object}
                                  className={`rounded-lg p-4 text-center transition-colors relative ${hasQuantity
                                    ? 'bg-slate-50 border-2 shadow-md'
                                    : 'bg-slate-50'
                                    }`}
                                  style={hasQuantity ? { borderColor: '#1c3957' } : {}}
                                >
                                  {/* Trash icon for custom objects */}
                                  {isCustomObject && (
                                    <button
                                      onClick={() => removeCustomHeavyObject(object)}
                                      className="absolute top-2 right-2 p-1 hover:bg-blue-100 rounded-full transition-colors"
                                      title="Supprimer cet objet personnalisé"
                                    >
                                      <Trash2 className="w-4 h-4" style={{ color: '#CC922F' }} />
                                    </button>
                                  )}

                                  <div className="flex justify-center mb-2">
                                    {getSpecialHeavyObjectIcon(object)}
                                  </div>
                                  <h3 className="text-sm font-medium text-slate-900 mb-3">
                                    {object}
                                    {isCustomObject && (
                                      <span className="text-xs ml-1" style={{ color: '#CC922F' }}>(Personnalisé)</span>
                                    )}
                                  </h3>
                                  <div className="flex items-center justify-center gap-3">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => updateSpecialObjectQuantity(object, -1)}
                                      disabled={!specialObjectQuantities[object]}
                                      className="w-8 h-8 p-0"
                                    >
                                      <Minus className="w-4 h-4" />
                                    </Button>
                                    <span className="text-lg font-medium min-w-[2rem] text-center">
                                      {specialObjectQuantities[object] || 0}
                                    </span>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => updateSpecialObjectQuantity(object, 1)}
                                      className="w-8 h-8 p-0"
                                    >
                                      <Plus className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              );
                            })}

                            {/* Add Custom Heavy Object */}
                            <div className="bg-slate-50 rounded-lg p-4 text-center">
                              <div className="flex items-center justify-center mx-auto mb-2">
                                <Plus className="w-10 h-10 font-bold" style={{ color: '#CC922F' }} />
                              </div>
                              <h3 className="text-sm font-medium text-slate-900 mb-3">
                                Ajouter un objet lourd
                              </h3>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs"
                                onClick={() => setShowAddHeavyObjectForm(!showAddHeavyObjectForm)}
                              >
                                Ajouter
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Add Heavy Object Form */}
                  {showAddHeavyObjectForm && (
                    <div className="max-w-4xl mx-auto mb-8">
                      <div className="bg-white border border-slate-200 rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold text-slate-900">Ajouter un objet lourd</h3>
                          <Button
                            size="sm"
                            onClick={() => setShowAddHeavyObjectForm(false)}
                            className="bg-[#1c3957] hover:bg-[#1c3957]/90 text-white"
                          >
                            Fermer
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Nature de l'objet and Quantité */}
                          <div className="space-y-2">
                            <Label htmlFor="heavy-nature" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                              <Tag className="w-4 h-4" style={{ color: '#CC922F' }} />
                              Nature de l'objet
                            </Label>
                            <Input
                              id="heavy-nature"
                              type="text"
                              placeholder="Ex: Piano à queue, Coffre fort..."
                              value={heavyObjectForm.nature}
                              onChange={(e) => setHeavyObjectForm(prev => ({ ...prev, nature: e.target.value }))}
                              className="w-full"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="heavy-quantite" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                              <Hash className="w-4 h-4" style={{ color: '#CC922F' }} />
                              Quantité
                            </Label>
                            <Input
                              id="heavy-quantite"
                              type="number"
                              placeholder="Ex: 1"
                              value={heavyObjectForm.quantite}
                              onChange={(e) => setHeavyObjectForm(prev => ({ ...prev, quantite: e.target.value }))}
                              className="w-full"
                              min="1"
                            />
                          </div>

                          {/* Dimensions */}
                          <div className="space-y-2">
                            <Label htmlFor="heavy-longueur" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                              <Ruler className="w-4 h-4" style={{ color: '#CC922F' }} />
                              Longueur (cm)
                            </Label>
                            <Input
                              id="heavy-longueur"
                              type="number"
                              placeholder="Ex: 200"
                              value={heavyObjectForm.longueur}
                              onChange={(e) => setHeavyObjectForm(prev => ({ ...prev, longueur: e.target.value }))}
                              className="w-full"
                              min="0"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="heavy-largeur" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                              <Ruler className="w-4 h-4" style={{ color: '#CC922F' }} />
                              Largeur (cm)
                            </Label>
                            <Input
                              id="heavy-largeur"
                              type="number"
                              placeholder="Ex: 150"
                              value={heavyObjectForm.largeur}
                              onChange={(e) => setHeavyObjectForm(prev => ({ ...prev, largeur: e.target.value }))}
                              className="w-full"
                              min="0"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="heavy-hauteur" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                              <Ruler className="w-4 h-4" style={{ color: '#CC922F' }} />
                              Hauteur (cm)
                            </Label>
                            <Input
                              id="heavy-hauteur"
                              type="number"
                              placeholder="Ex: 100"
                              value={heavyObjectForm.hauteur}
                              onChange={(e) => setHeavyObjectForm(prev => ({ ...prev, hauteur: e.target.value }))}
                              className="w-full"
                              min="0"
                            />
                          </div>

                          {/* Ajouter Button */}
                          <div className="flex items-end">
                            <Button
                              onClick={handleAddHeavyObject}
                              className="w-full bg-[#1c3957] hover:bg-[#1c3957]/90 text-white"
                              disabled={!heavyObjectForm.nature.trim() || !heavyObjectForm.quantite.trim()}
                            >
                              Ajouter
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <Button
                      onClick={handleBackToMethods}
                      className="flex items-center gap-2 bg-[#1c3957] hover:bg-[#1c3957]/90 text-white"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      RETOUR
                    </Button>
                    <Button
                      className="bg-[#1c3957] hover:bg-[#1c3957]/90 text-white flex-1"
                      onClick={submitManualSelection}
                    >
                      CONTINUER →
                    </Button>
                  </div>
                </>
              )}

              {currentPage === "volume" && selectedMethod === "surface" && (
                <>
                  {/* Sophie's Profile - Surface Page */}
                  <div className="flex flex-col sm:flex-row items-start gap-4 mb-6 sm:mb-8">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden flex-shrink-0">
                      <ImageWithFallback
                        src="/sophie.jpeg"
                        alt="Sophie"
                        className="w-full h-full object-cover"
                        style={{ transform: 'scale(1.2)' }}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-lg font-semibold text-slate-900 mb-1">
                        Sophie
                      </p>
                      <p className="text-primary text-sm">
                        Parfait ! Indiquez-moi la surface de votre logement pour une estimation rapide.
                      </p>
                    </div>
                  </div>

                  {/* Surface Input */}
                  <div className="space-y-6">
                    <div>
                      <Label
                        htmlFor="surface"
                        className="text-slate-900 mb-3 block text-base font-medium"
                      >
                        Renseignez la surface du logement à déménager
                      </Label>
                      <div className="relative">
                        <Input
                          id="surface"
                          type="number"
                          placeholder="Ex: 75"
                          value={surfaceArea}
                          onChange={(e) => setSurfaceArea(e.target.value)}
                          className="bg-slate-50 border-slate-200 h-12 text-base pr-16"
                          min="0"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 font-medium">
                          m²
                        </div>
                      </div>
                      <p className="text-sm text-slate-500 mt-2">
                        Entrez la surface totale de votre logement en mètres carrés
                      </p>
                    </div>

                    {/* Housing details (admin recap) */}
                    <div className="bg-slate-50 rounded-lg p-4 sm:p-6">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                            Votre logement est-il plutôt ?
                          </h3>
                          <p className="text-sm text-slate-600">
                            Ces informations nous aident à affiner l’estimation et à préparer l’intervention.
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                            {([
                              { value: "aerien", label: "Aérien" },
                              { value: "normal", label: "Normal" },
                              { value: "charge", label: "Chargé" },
                            ] as const).map((opt) => (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => {
                                  const next = logementType === opt.value ? "" : opt.value;
                                  setLogementType(next);
                                }}
                                className={`w-full flex items-center gap-3 rounded-lg border p-3 text-left transition-colors ${logementType === opt.value ? 'border-[#1c3957] bg-white shadow-sm' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
                              >
                                <Checkbox checked={logementType === opt.value} />
                                <span className="text-sm font-medium text-slate-900">{opt.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                            Depuis quand êtes-vous dans ce logement ?
                          </h3>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                            {([
                              { value: "0_2", label: "0–2 ans" },
                              { value: "2_5", label: "2–5 ans" },
                              { value: "5_plus", label: "Plus de 5 ans" },
                            ] as const).map((opt) => (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => {
                                  const next = ancienneteLogement === opt.value ? "" : opt.value;
                                  setAncienneteLogement(next);
                                }}
                                className={`w-full flex items-center gap-3 rounded-lg border p-3 text-left transition-colors ${ancienneteLogement === opt.value ? 'border-[#1c3957] bg-white shadow-sm' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
                              >
                                <Checkbox checked={ancienneteLogement === opt.value} />
                                <span className="text-sm font-medium text-slate-900">{opt.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Special Objects Question */}
                    <div className="w-full max-w-4xl mx-auto mb-6 sm:mb-8">
                      <div className="bg-slate-50 rounded-lg p-4 sm:p-6">
                        <div className="mb-4">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                            <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                              Avez-vous des objets particuliers ou de + de 80kgs à déménager ?
                            </h3>
                            <button
                              onClick={handleSpecialObjectsToggle}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ml-2 ${hasSpecialObjects ? 'bg-[#1c3957]' : 'bg-slate-300'
                                }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${hasSpecialObjects ? 'translate-x-6' : 'translate-x-1'
                                  }`}
                              />
                            </button>
                          </div>
                          <p className="text-sm text-slate-600">
                            Sélectionnez les objets lourds qui nécessitent une attention particulière
                          </p>
                        </div>

                        {/* Special Objects Grid */}
                        {hasSpecialObjects && (
                          <div className="mt-6">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                              {superficieSpecialObjects.map((object) => {
                                const hasQuantity = specialObjectQuantities[object] && specialObjectQuantities[object] > 0;
                                // Check if this is a custom object
                                const isCustomObject = superficieCustomHeavyObjects.includes(object);

                                return (
                                  <div
                                    key={object}
                                    className={`rounded-lg p-4 text-center transition-colors relative ${hasQuantity
                                      ? 'bg-slate-50 border-2 shadow-md'
                                      : 'bg-slate-50'
                                      }`}
                                    style={hasQuantity ? { borderColor: '#1c3957' } : {}}
                                  >
                                    {/* Trash icon for custom objects */}
                                    {isCustomObject && (
                                      <button
                                        onClick={() => removeSuperficieCustomHeavyObject(object)}
                                        className="absolute top-2 right-2 p-1 hover:bg-blue-100 rounded-full transition-colors"
                                        title="Supprimer cet objet personnalisé"
                                      >
                                        <Trash2 className="w-4 h-4" style={{ color: '#CC922F' }} />
                                      </button>
                                    )}

                                    <div className="flex justify-center mb-2">
                                      {getSpecialHeavyObjectIcon(object)}
                                    </div>
                                    <h3 className="text-sm font-medium text-slate-900 mb-1">
                                      {object}
                                    </h3>
                                    {isCustomObject && (
                                      <p className="text-xs mb-2" style={{ color: '#CC922F' }}>
                                        (Personnalisé)
                                      </p>
                                    )}
                                    <div className="flex items-center justify-center gap-3">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => updateSpecialObjectQuantity(object, -1)}
                                        disabled={!specialObjectQuantities[object]}
                                        className="w-8 h-8 p-0"
                                      >
                                        <Minus className="w-4 h-4" />
                                      </Button>
                                      <span className="text-lg font-semibold min-w-[2rem] text-center">
                                        {specialObjectQuantities[object] || 0}
                                      </span>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => updateSpecialObjectQuantity(object, 1)}
                                        className="w-8 h-8 p-0"
                                      >
                                        <Plus className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </div>
                                );
                              })}

                              {/* Add Custom Heavy Object */}
                              <div className="bg-slate-50 rounded-lg p-4 text-center">
                                <div className="flex items-center justify-center mx-auto mb-2">
                                  <Plus className="w-10 h-10 font-bold" style={{ color: '#CC922F' }} />
                                </div>
                                <h3 className="text-sm font-medium text-slate-900 mb-3">
                                  Ajouter un objet lourd
                                </h3>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-xs"
                                  onClick={() => setShowAddHeavyObjectForm(!showAddHeavyObjectForm)}
                                >
                                  Ajouter
                                </Button>
                              </div>
                            </div>

                            {/* Add Custom Heavy Object Form */}
                            {showAddHeavyObjectForm && (
                              <div className="mt-6 p-6 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
                                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                                  Ajouter un objet lourd personnalisé
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="heavy-nature" className="text-slate-700 font-medium">
                                      Nature de l'objet
                                    </Label>
                                    <Input
                                      id="heavy-nature"
                                      placeholder="Ex: Piano à queue"
                                      value={heavyObjectForm.nature}
                                      onChange={(e) => setHeavyObjectForm(prev => ({ ...prev, nature: e.target.value }))}
                                      className="mt-1"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="heavy-quantite" className="text-slate-700 font-medium">
                                      Quantité
                                    </Label>
                                    <Input
                                      id="heavy-quantite"
                                      type="number"
                                      placeholder="Ex: 1"
                                      value={heavyObjectForm.quantite}
                                      onChange={(e) => setHeavyObjectForm(prev => ({ ...prev, quantite: e.target.value }))}
                                      className="mt-1"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="heavy-longueur" className="text-slate-700 font-medium">
                                      Longueur (cm)
                                    </Label>
                                    <Input
                                      id="heavy-longueur"
                                      type="number"
                                      placeholder="Ex: 150"
                                      value={heavyObjectForm.longueur}
                                      onChange={(e) => setHeavyObjectForm(prev => ({ ...prev, longueur: e.target.value }))}
                                      className="mt-1"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="heavy-largeur" className="text-slate-700 font-medium">
                                      Largeur (cm)
                                    </Label>
                                    <Input
                                      id="heavy-largeur"
                                      type="number"
                                      placeholder="Ex: 100"
                                      value={heavyObjectForm.largeur}
                                      onChange={(e) => setHeavyObjectForm(prev => ({ ...prev, largeur: e.target.value }))}
                                      className="mt-1"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="heavy-hauteur" className="text-slate-700 font-medium">
                                      Hauteur (cm)
                                    </Label>
                                    <Input
                                      id="heavy-hauteur"
                                      type="number"
                                      placeholder="Ex: 80"
                                      value={heavyObjectForm.hauteur}
                                      onChange={(e) => setHeavyObjectForm(prev => ({ ...prev, hauteur: e.target.value }))}
                                      className="mt-1"
                                    />
                                  </div>
                                </div>
                                <div className="flex gap-3 mt-4">
                                  <Button
                                    onClick={handleAddSuperficieHeavyObject}
                                    className="bg-[#1c3957] hover:bg-[#1c3957]/90 text-white"
                                    disabled={!heavyObjectForm.nature.trim() || !heavyObjectForm.quantite.trim()}
                                  >
                                    Ajouter l'objet
                                  </Button>
                                  <Button
                                    variant="outline"
                                    onClick={() => setShowAddHeavyObjectForm(false)}
                                  >
                                    Annuler
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 mt-8">
                      <Button
                        onClick={handleBackFromSurface}
                        className="flex items-center gap-2 bg-[#1c3957] hover:bg-[#1c3957]/90 text-white hover:text-white"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        RETOUR
                      </Button>
                      <Button
                        size="lg"
                        className="bg-[#1c3957] hover:bg-[#1c3957]/90 text-white hover:text-white flex-1 disabled:bg-slate-400"
                        onClick={handleContinueFromSurface}
                      disabled={
                        !surfaceArea ||
                        parseInt(surfaceArea) <= 0 ||
                        !ancienneteLogement
                      }
                      >
                        CONTINUER →
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {currentPage === "volume" && selectedMethod === "photo" && (
                <>
                  {/* AI Photo Method Interface */}
                  <div className="text-center mb-6 sm:mb-8">
                    <h2 className="text-xl sm:text-2xl font-bold mb-2">Sélectionnez le type de pièce</h2>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Choisissez la pièce et ajoutez vos photos pour un devis précis
                    </p>
                  </div>

                  {/* Hidden file input */}
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    id="photo-upload"
                    onChange={(e) => {
                      if (!selectedRoom) {
                        alert('Veuillez d\'abord sélectionner une pièce');
                        return;
                      }
                      handleImageUpload(e, selectedRoom);
                    }}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 w-full max-w-4xl mx-auto mb-6 sm:mb-8">
                    {/* Regular rooms */}
                    {rooms.map((room) => {
                      const isSelected = selectedRoom === room;
                      const roomImages = uploadedImages.filter(img => img.roomId === room);

                      return (
                        <div
                          key={room}
                          className={`room-card ${isSelected ? 'selected' : ''} relative group cursor-pointer h-48`}
                          onClick={() => setSelectedRoom(room)}
                        >
                          <div className="flex flex-col items-center text-center space-y-3 p-4 border rounded-lg h-full">
                            <div className="relative">
                              <div
                                className={`p-3 rounded-lg ${isSelected
                                  ? 'bg-[#1c3957] text-white'
                                  : 'bg-slate-100 text-slate-600'
                                  }`}
                                style={{ color: isSelected ? 'white' : '#CC922F' }}
                              >
                                {getRoomIcon(room)}
                              </div>
                            </div>

                            {/* Camera icon at bottom-right */}
                            <div
                              className="absolute bottom-2 right-2 bg-[#CC922F] text-white p-2 rounded-full cursor-pointer hover:bg-[#CC922F]/90 transition-colors shadow-lg"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedRoom(room);
                                document.getElementById('photo-upload')?.click();
                              }}
                              title="Ajouter des photos"
                            >
                              <Camera className="w-4 h-4" />
                            </div>

                            <div>
                              <h3 className="font-semibold text-lg">{room}</h3>
                              <p className="text-sm text-slate-500">Pièce de vie</p>
                            </div>

                            {/* Uploaded images as small icons */}
                            {roomImages.length > 0 && (
                              <div className="flex flex-wrap gap-1 justify-center mt-2">
                                {roomImages.map((image) => (
                                  <div key={image.id} className="relative group">
                                    <img
                                      src={image.preview}
                                      alt={`Photo ${room}`}
                                      className="w-8 h-8 object-cover rounded border border-gray-300"
                                    />
                                    {/* Delete button for image */}
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteImage(image.id);
                                      }}
                                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center hover:bg-red-600 transition-colors text-xs"
                                      title="Supprimer cette photo"
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {/* Custom rooms */}
                    {customRooms.map((room) => {
                      const isSelected = selectedRoom === room;
                      const roomImages = uploadedImages.filter(img => img.roomId === room);

                      return (
                        <div
                          key={room}
                          className={`room-card ${isSelected ? 'selected' : ''} relative group cursor-pointer h-48`}
                          onClick={() => setSelectedRoom(room)}
                        >
                          <div className="flex flex-col items-center text-center space-y-3 p-4 border rounded-lg h-full">
                            <div className={`p-3 rounded-lg ${isSelected
                              ? 'bg-[#1c3957] text-white'
                              : 'bg-slate-100 text-slate-600'
                              }`}>
                              <Package className="w-6 h-6" />
                            </div>
                            <div className="flex-1 flex flex-col justify-center">
                              <h3 className="font-medium text-slate-900 mb-1">{room}</h3>
                              <p className="text-xs text-slate-500">
                                {roomImages.length} photo{roomImages.length > 1 ? 's' : ''}
                              </p>
                            </div>
                            {roomImages.length > 0 && (
                              <div className="flex flex-wrap gap-1 justify-center mt-2 max-h-16 overflow-y-auto">
                                {roomImages.slice(0, 3).map((img, index) => (
                                  <img
                                    key={index}
                                    src={img.preview}
                                    alt={`Preview ${index + 1}`}
                                    className="w-8 h-8 object-cover rounded border"
                                  />
                                ))}
                                {roomImages.length > 3 && (
                                  <div className="w-8 h-8 bg-slate-200 rounded border flex items-center justify-center text-xs">
                                    +{roomImages.length - 3}
                                  </div>
                                )}
                              </div>
                            )}
                            {/* Camera icon at bottom-right */}
                            <div
                              className="absolute bottom-2 right-2 bg-[#CC922F] text-white p-2 rounded-full cursor-pointer hover:bg-[#CC922F]/90 transition-colors shadow-lg"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedRoom(room);
                                document.getElementById('photo-upload')?.click();
                              }}
                            >
                              <Camera className="w-4 h-4" />
                            </div>

                            {/* Delete button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveCustomRoom(room);
                              }}
                              className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {/* Add Room Card */}
                    <div className="room-card relative group cursor-pointer h-48">
                      <div className="flex flex-col items-center text-center space-y-3 p-4 border rounded-lg h-full">
                        <div className="p-3 rounded-lg bg-slate-100 text-slate-600">
                          <Plus className="w-6 h-6" />
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          {isAddingRoom ? (
                            <Input
                              type="text"
                              placeholder="Nom de la pièce"
                              value={newRoomName}
                              onChange={(e) => setNewRoomName(e.target.value)}
                              className="text-center text-sm font-medium mb-1"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  handleAddCustomRoom();
                                }
                              }}
                              onBlur={() => {
                                if (newRoomName.trim()) {
                                  handleAddCustomRoom();
                                } else {
                                  setIsAddingRoom(false);
                                }
                              }}
                              onFocus={(e) => {
                                e.target.select();
                              }}
                              autoFocus
                            />
                          ) : (
                            <h3
                              className="font-medium text-slate-900 mb-1 cursor-pointer"
                              onClick={() => {
                                setIsAddingRoom(true);
                                setNewRoomName("Ajouter un objet");
                              }}
                            >
                              Ajouter un objet
                            </h3>
                          )}
                          <p className="text-xs text-slate-500">
                            {isAddingRoom ? "Appuyez sur Entrée ou cliquez sur +" : "Cliquez sur + pour ajouter"}
                          </p>
                        </div>

                        {/* Camera Button */}
                        <div className="flex justify-center">
                          <div
                            className="bg-[#CC922F] text-white p-2 rounded-full cursor-pointer hover:bg-[#CC922F]/90 transition-colors shadow-lg"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isAddingRoom) {
                                // If already adding room, just open photo upload
                                document.getElementById('photo-upload')?.click();
                              } else {
                                // If not adding room, start adding room process and open photo upload
                                setIsAddingRoom(true);
                                setNewRoomName("Ajouter un objet");
                                // Open photo upload after a short delay to ensure state is updated
                                setTimeout(() => {
                                  document.getElementById('photo-upload')?.click();
                                }, 100);
                              }
                            }}
                          >
                            <Camera className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>


                  {/* Analysis Section */}
                  {uploadedImages.length > 0 && (
                    <div className="text-center mb-8">
                      {isAnalyzing ? (
                        <div className="max-w-md mx-auto">
                          <div className="w-16 h-16 bg-[#1c3957] rounded-full flex items-center justify-center mx-auto mb-6">
                            <Zap className="w-8 h-8 text-white" />
                          </div>
                          <h2 className="text-2xl font-bold mb-4 text-center text-slate-900">Analyse IA en cours...</h2>
                          <p className="text-center text-slate-600 mb-6">
                            Notre IA analyse vos photos pour estimer le volume et la complexité de votre déménagement.
                          </p>
                          <div className="w-full bg-slate-200 rounded-full h-2 mb-4">
                            <div
                              className="bg-[#1c3957] h-2 rounded-full transition-all duration-500"
                              style={{ width: `${analysisProgress}%` }}
                            />
                          </div>
                          <p className="text-sm text-slate-500 text-center">
                            Analyse de {uploadedImages.length} photo(s)...
                          </p>
                        </div>
                      ) : analysisResults ? (
                        <div className="max-w-md mx-auto">
                          {analysisResults.success ? (
                            <>
                              <div className="w-16 h-16 bg-[#1c3957] rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-8 h-8 text-white" />
                              </div>
                              <h2 className="text-2xl font-bold mb-4 text-[#1c3957]">Analyse terminée !</h2>
                              <p className="text-slate-600 mb-6">Vos photos ont été analysées avec succès. Consultez les résultats détaillés ci-dessous.</p>
                              <Button
                                onClick={() => navigate("/tunnel/ai-results")}
                                className="px-8 py-3 bg-[#1c3957] hover:bg-[#1c3957]/90 text-white"
                              >
                                Voir les résultats détaillés
                              </Button>
                            </>
                          ) : (
                            <>
                              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <AlertCircle className="w-8 h-8 text-white" />
                              </div>
                              <h2 className="text-2xl font-bold mb-4 text-red-600">Erreur d'analyse</h2>
                              <p className="text-red-600 mb-6">{analysisResults.error}</p>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setAnalysisResults(null);
                                  setUploadedImages([]);
                                }}
                              >
                                Réessayer
                              </Button>
                            </>
                          )}
                        </div>
                      ) : (
                        <Button
                          onClick={analyzeImages}
                          className="px-8 py-3"
                        >
                          Analyser les photos
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Special Objects Section */}
                  {!isAnalyzing && !analysisResults && (
                    <>
                      {/* Special Objects Question */}
                      <div className="max-w-4xl mx-auto mb-8">
                        <div className="bg-slate-50 rounded-lg p-6">
                          <div className="mb-4">
                            <div className="flex items-center mb-2">
                              <h3 className="text-lg font-semibold text-slate-900">
                                Avez-vous des objets particuliers ou de + de 80kgs à déménager ?
                              </h3>
                              <button
                                onClick={handleSpecialObjectsToggle}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ml-2 ${hasSpecialObjects ? 'bg-[#1c3957]' : 'bg-slate-300'
                                  }`}
                              >
                                <span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${hasSpecialObjects ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                />
                              </button>
                            </div>
                            <p className="text-sm text-slate-600">
                              Sélectionnez les objets lourds qui nécessitent une attention particulière
                            </p>
                          </div>

                          {/* Special Objects Grid */}
                          {hasSpecialObjects && (
                            <div className="mt-6">
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {aiSpecialObjects.map((object) => {
                                  const hasQuantity = specialObjectQuantities[object] && specialObjectQuantities[object] > 0;
                                  // Check if this is a custom object
                                  const isCustomObject = aiCustomHeavyObjects.includes(object);

                                  return (
                                    <div
                                      key={object}
                                      className={`rounded-lg p-4 text-center transition-colors relative ${hasQuantity
                                        ? 'bg-slate-50 border-2 shadow-md'
                                        : 'bg-slate-50'
                                        }`}
                                      style={hasQuantity ? { borderColor: '#1c3957' } : {}}
                                    >
                                      {/* Trash icon for custom objects */}
                                      {isCustomObject && (
                                        <button
                                          onClick={() => removeAiCustomHeavyObject(object)}
                                          className="absolute top-2 right-2 p-1 hover:bg-blue-100 rounded-full transition-colors"
                                          title="Supprimer cet objet personnalisé"
                                        >
                                          <Trash2 className="w-4 h-4" style={{ color: '#CC922F' }} />
                                        </button>
                                      )}

                                      <div className="flex justify-center mb-2">
                                        {getSpecialHeavyObjectIcon(object)}
                                      </div>
                                      <h3 className="text-sm font-medium text-slate-900 mb-3">
                                        {object}
                                        {isCustomObject && (
                                          <span className="text-xs ml-1" style={{ color: '#CC922F' }}>(Personnalisé)</span>
                                        )}
                                      </h3>
                                      <div className="flex items-center justify-center gap-3">
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => updateSpecialObjectQuantity(object, -1)}
                                          disabled={!specialObjectQuantities[object]}
                                          className="w-8 h-8 p-0"
                                        >
                                          <Minus className="w-4 h-4" />
                                        </Button>
                                        <span className="text-lg font-semibold min-w-[2rem] text-center">
                                          {specialObjectQuantities[object] || 0}
                                        </span>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => updateSpecialObjectQuantity(object, 1)}
                                          className="w-8 h-8 p-0"
                                        >
                                          <Plus className="w-4 h-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  );
                                })}

                                {/* Add Custom Heavy Object */}
                                <div className="bg-slate-50 rounded-lg p-4 text-center">
                                  <div className="flex items-center justify-center mx-auto mb-2">
                                    <Plus className="w-10 h-10 font-bold" style={{ color: '#CC922F' }} />
                                  </div>
                                  <h3 className="text-sm font-medium text-slate-900 mb-3">
                                    Ajouter un objet lourd
                                  </h3>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-xs"
                                    onClick={() => setShowAddHeavyObjectForm(!showAddHeavyObjectForm)}
                                  >
                                    Ajouter
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                    </>
                  )}

                  {/* Add Heavy Object Form */}
                  {showAddHeavyObjectForm && (
                    <div className="max-w-4xl mx-auto mb-8">
                      <div className="bg-white border border-slate-200 rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold text-slate-900">Ajouter un objet lourd</h3>
                          <Button
                            size="sm"
                            onClick={() => setShowAddHeavyObjectForm(false)}
                            className="bg-[#1c3957] hover:bg-[#1c3957]/90 text-white"
                          >
                            Fermer
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Nature de l'objet and Quantité */}
                          <div className="space-y-2">
                            <Label htmlFor="heavy-nature-ai" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                              <Tag className="w-4 h-4" style={{ color: '#CC922F' }} />
                              Nature de l'objet
                            </Label>
                            <Input
                              id="heavy-nature-ai"
                              type="text"
                              placeholder="Ex: Piano à queue, Coffre fort..."
                              value={heavyObjectForm.nature}
                              onChange={(e) => setHeavyObjectForm(prev => ({ ...prev, nature: e.target.value }))}
                              className="w-full"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="heavy-quantite-ai" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                              <Hash className="w-4 h-4" style={{ color: '#CC922F' }} />
                              Quantité
                            </Label>
                            <Input
                              id="heavy-quantite-ai"
                              type="number"
                              placeholder="Ex: 1"
                              value={heavyObjectForm.quantite}
                              onChange={(e) => setHeavyObjectForm(prev => ({ ...prev, quantite: e.target.value }))}
                              className="w-full"
                              min="1"
                            />
                          </div>

                          {/* Dimensions */}
                          <div className="space-y-2">
                            <Label htmlFor="heavy-longueur-ai" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                              <Ruler className="w-4 h-4" style={{ color: '#CC922F' }} />
                              Longueur (cm)
                            </Label>
                            <Input
                              id="heavy-longueur-ai"
                              type="number"
                              placeholder="Ex: 200"
                              value={heavyObjectForm.longueur}
                              onChange={(e) => setHeavyObjectForm(prev => ({ ...prev, longueur: e.target.value }))}
                              className="w-full"
                              min="0"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="heavy-largeur-ai" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                              <Ruler className="w-4 h-4" style={{ color: '#CC922F' }} />
                              Largeur (cm)
                            </Label>
                            <Input
                              id="heavy-largeur-ai"
                              type="number"
                              placeholder="Ex: 150"
                              value={heavyObjectForm.largeur}
                              onChange={(e) => setHeavyObjectForm(prev => ({ ...prev, largeur: e.target.value }))}
                              className="w-full"
                              min="0"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="heavy-hauteur-ai" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                              <Ruler className="w-4 h-4" style={{ color: '#CC922F' }} />
                              Hauteur (cm)
                            </Label>
                            <Input
                              id="heavy-hauteur-ai"
                              type="number"
                              placeholder="Ex: 100"
                              value={heavyObjectForm.hauteur}
                              onChange={(e) => setHeavyObjectForm(prev => ({ ...prev, hauteur: e.target.value }))}
                              className="w-full"
                              min="0"
                            />
                          </div>

                          {/* Ajouter Button */}
                          <div className="flex items-end">
                            <Button
                              onClick={handleAddAiHeavyObject}
                              className="w-full bg-[#1c3957] hover:bg-[#1c3957]/90 text-white"
                              disabled={!heavyObjectForm.nature.trim() || !heavyObjectForm.quantite.trim()}
                            >
                              Ajouter
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons - Always visible */}
                  <div className="flex gap-4 mt-8">
                    <Button
                      onClick={handleBackToMethods}
                      className="flex items-center gap-2 bg-[#1c3957] hover:bg-[#1c3957]/90 text-white"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      RETOUR
                    </Button>
                    <Button
                      className="bg-[#1c3957] hover:bg-[#1c3957]/90 text-white flex-1 disabled:bg-slate-400 disabled:cursor-not-allowed"
                      onClick={() => {
                        if (uploadedImages.length > 0) {
                          analyzeImages();
                        } else {
                          navigate("/tunnel/adresses");
                        }
                      }}
                      disabled={!canContinueAI()}
                    >
                      CONTINUER →
                    </Button>
                  </div>
                </>
              )}

              {currentPage === "ai-results" && (
                <>
                  {/* AI Results Page */}
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold mb-2">Résultats de l'analyse IA</h2>
                    <p className="text-muted-foreground">
                      Voici les objets détectés dans vos photos
                    </p>
                  </div>

                  {/* Analysis Results Display */}
                  {analysisResults && analysisResults.success ? (
                    <div className="max-w-6xl mx-auto mb-8">
                      <div className="bg-transparent border border-[#1c3957] rounded-lg p-6 mb-6">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 bg-[#1c3957] rounded-full flex items-center justify-center mr-4">
                            <CheckCircle className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-[#1c3957]">Analyse terminée avec succès</h3>
                            <p className="text-[#1c3957]/80">Vos photos ont été analysées par notre IA</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-white rounded-lg p-4 border border-[#1c3957]">
                            <h4 className="font-semibold text-slate-900 mb-2">Résumé de l'analyse</h4>
                            <p className="text-slate-700">{analysisResults.summary}</p>
                          </div>

                          <div className="bg-white rounded-lg p-4 border border-[#1c3957]">
                            <h4 className="font-semibold text-slate-900 mb-2">Statistiques</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-slate-600">Total d'objets:</span>
                                <span className="font-semibold">{analysisResults.total_objects}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-600">Pièces analysées:</span>
                                <span className="font-semibold">{uploadedImages.length}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Room-by-Room Analysis */}
                      <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-slate-900 text-center mb-6">
                          Objets détectés par pièce
                        </h3>

                        {Object.entries(roomAnalysisResults).map(([roomId, objects]) => (
                          <div key={roomId} className="bg-white border border-slate-200 rounded-lg p-6">
                            <div className="flex items-center mb-4">
                              <div className="p-2 bg-slate-100 rounded-lg mr-3">
                                <div style={{ color: '#CC922F' }}>
                                  {getRoomIcon(roomId)}
                                </div>
                              </div>
                              <h4 className="text-lg font-semibold text-slate-900">{roomId}</h4>
                            </div>

                            {Object.keys(objects).length > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {Object.entries(objects).map(([object, objectData]) => {
                                  // Handle both old (number) and new (object) data structures
                                  const quantity = typeof objectData === 'number' ? objectData : (objectData && typeof objectData === 'object' && 'quantity' in objectData ? objectData.quantity : 0);
                                  const isUserAdded = typeof objectData === 'object' && objectData !== null && 'is_ai_detected' in objectData && objectData.is_ai_detected === false;

                                  return (
                                    <div
                                      key={object}
                                      className={`bg-slate-50 rounded-lg p-4 relative ${isUserAdded ? 'border-2 border-[#CC922F]' : 'border border-slate-200'
                                        }`}
                                    >
                                      {/* Delete button for user-added objects */}
                                      {isUserAdded && (
                                        <button
                                          onClick={() => removeObjectFromRoom(roomId, object)}
                                          className="absolute top-2 right-2 p-1 hover:bg-[#CC922F]/20 rounded-full transition-colors"
                                          title="Supprimer cet objet"
                                        >
                                          <Trash2 className="w-4 h-4 text-[#CC922F]" />
                                        </button>
                                      )}

                                      <div className="flex flex-col items-center mb-2">
                                        <h5 className="font-medium text-slate-900 mb-2">{object}</h5>
                                        {isUserAdded && (
                                          <span className="text-xs bg-[#CC922F] text-white px-2 py-1 rounded-full">
                                            Ajouté
                                          </span>
                                        )}
                                      </div>
                                      <div className="flex items-center justify-center gap-3">
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => updateRoomObjectQuantity(roomId, object, -1)}
                                          disabled={quantity <= 0}
                                          className="w-8 h-8 p-0"
                                        >
                                          <Minus className="w-4 h-4" />
                                        </Button>
                                        <span className="text-lg font-semibold min-w-[2rem] text-center">
                                          {quantity}
                                        </span>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => updateRoomObjectQuantity(roomId, object, 1)}
                                          className="w-8 h-8 p-0"
                                        >
                                          <Plus className="w-4 h-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <p className="text-slate-500 text-center py-4">
                                Aucun objet détecté dans cette pièce
                              </p>
                            )}

                            {/* Add New Object */}
                            <div className="mt-4 pt-4 border-t border-slate-200">
                              <div className="relative">
                                <Input
                                  type="text"
                                  placeholder="Ajouter un objet manquant..."
                                  className="flex-1"
                                  value={newObjectInputs[roomId] || ''}
                                  onChange={(e) => {
                                    setNewObjectInputs(prev => ({
                                      ...prev,
                                      [roomId]: e.target.value
                                    }));
                                  }}
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                      addNewObjectToRoom(roomId, e.currentTarget.value.trim());
                                      setNewObjectInputs(prev => ({
                                        ...prev,
                                        [roomId]: ''
                                      }));
                                    }
                                  }}
                                />

                                {/* Autocomplete dropdown */}
                                {newObjectInputs[roomId] && newObjectInputs[roomId].length > 0 && (
                                  <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-lg shadow-lg z-10 mt-1 max-h-40 overflow-y-auto">
                                    {(() => {
                                      // Get current room objects
                                      const currentRoomObjects = Object.keys(objects);

                                      // Map frontend room names to backend room keys
                                      const roomMapping: Record<string, string> = {
                                        'Entrée': 'entree',
                                        'Salle de bain': 'salle-de-bain',
                                        'Salon': 'salon',
                                        'Cuisine': 'cuisine',
                                        'Salle à manger': 'salle-a-manger',
                                        'Chambre': 'chambre',
                                        'Cave': 'cave',
                                        'Jardin': 'jardin',
                                        'Garage': 'garage',
                                        'Autre': 'autre'
                                      };

                                      // Add objects from backend ROOM_OBJECTS for each room type
                                      const commonObjects: Record<string, string[]> = {
                                        'entree': ['Banc', 'Cadre', 'Carton', 'Console', 'Etagére muale', 'Meuble a chaussure', 'Miroir', 'Porte manteau', 'Coffre pour s\'assoir et mettre les chaussures', 'Tapis'],
                                        'salle-de-bain': ['Boîte ou panier', 'Carton', 'Coffre a linge', 'Colonne salle de bain', 'Lave linge', 'Meuble salle de bain', 'Miroir', 'Tapis petit', 'Baignoire enfant'],
                                        'salon': ['Canapé 3 places (-80KG)', 'Canapé d\'angle (-80KG)', 'Carton', 'hifi', 'Lampadaire', 'Meuble TV bas', 'Table basse', 'Télevision', 'Fauteuil', 'Pouf', 'Tapis', 'Cadre', 'Miroir', 'Banc', 'Etendoir'],
                                        'cuisine': ['Boîte ou panier', 'Carton', 'Cuisinière (-80KG)', 'Four', 'Frigo-congélateur', 'Lave vaisselle', 'Micro ondes', 'Etagère', 'Meuble bas de cuisine', 'Meuble haut de cuisine', 'Tabouret', 'Chaise', 'Four piano 6 têtes'],
                                        'salle-a-manger': ['Buffet haut', 'Cadre', 'Chaise', 'Moyenne table', 'Plante en pot', 'Tapis moyen', 'Vaisselier (-80KG)', 'Commode', 'Buffet complet haut + bas', 'Bibliothèque'],
                                        'chambre': ['Armoire 2p (-80KG)', 'Bureau', 'Carton', 'Chaise de bureau', 'Commode', 'lit double', 'lit simple', 'Tapis moyen', 'Table de nuit', 'Banc', 'Tête de lit', 'TV', 'Table à langer bébé', 'Coiffeuse'],
                                        'cave': ['Armoire ancienne (-80KG)', 'Barbecue', 'Carton', 'Coffre de rangement', 'Echelle', 'Escabeau', 'valises', 'Etagére', 'Climatisation'],
                                        'jardin': ['Carton', 'Chaise', 'Coffre de rangement', 'Etendoir', 'Parasol', 'Table de jardin', 'Transat', 'Vélo', 'Poussette', 'Scooter (moto)'],
                                        'garage': ['Aspirateur', 'Carton', 'Coffre de rangement', 'Lave linge', 'séche linge', 'Vélo', 'Table de ping-pong (-80KG)', 'Etagère'],
                                        'autre': ['Carton', 'Chiffronier', 'Guitare', 'Lampe de bureau', 'Paravent', 'Vélo d\'intérieur (-80KG)', 'Tapis de course (-80KG)', 'Banc de musculation (-80KG)', 'Ecran ordinateur', 'Imprimante', 'Imprimante pro', 'Cave à vin']
                                      };

                                      // Get the backend room key for this frontend room name
                                      const backendRoomKey = roomMapping[roomId] || roomId;

                                      // Combine current room objects with common objects for this room
                                      const allSuggestions = [
                                        ...currentRoomObjects,
                                        ...(commonObjects[backendRoomKey] || [])
                                      ];

                                      // Remove duplicates and filter by input
                                      const uniqueSuggestions = [...new Set(allSuggestions)]
                                        .filter(objectName =>
                                          objectName.toLowerCase().includes(newObjectInputs[roomId].toLowerCase())
                                        );

                                      return uniqueSuggestions;
                                    })().map((objectName) => {
                                      // Check if this is a detected object or a common object suggestion
                                      const isDetectedObject = objects.hasOwnProperty(objectName);
                                      const objectData = isDetectedObject ? objects[objectName] : null;
                                      const quantity = isDetectedObject ? (typeof objectData === 'number' ? objectData : (objectData && typeof objectData === 'object' && 'quantity' in objectData ? objectData.quantity : 0)) : 0;
                                      const isUserAdded = isDetectedObject && typeof objectData === 'object' && objectData !== null && 'is_ai_detected' in objectData && objectData.is_ai_detected === false;

                                      return (
                                        <div
                                          key={objectName}
                                          className={`p-3 cursor-pointer hover:bg-slate-50 border-b border-slate-100 last:border-b-0 ${isUserAdded ? 'bg-[#CC922F]/10 border-l-4 border-l-[#CC922F]' : ''
                                            }`}
                                          onClick={() => {
                                            // Add the object to the room
                                            addNewObjectToRoom(roomId, objectName);
                                            // Clear the input
                                            setNewObjectInputs(prev => ({
                                              ...prev,
                                              [roomId]: ''
                                            }));
                                          }}
                                        >
                                          <div className="flex items-center justify-between">
                                            <span className={`font-medium ${isUserAdded ? 'text-[#CC922F]' : 'text-slate-900'}`}>{objectName}</span>
                                            <div className="flex items-center gap-2">
                                              {isDetectedObject ? (
                                                <>
                                                  {isUserAdded && (
                                                    <span className="text-xs bg-[#CC922F] text-white px-2 py-1 rounded-full">
                                                      Ajouté
                                                    </span>
                                                  )}
                                                  <span className="text-sm text-slate-500">({quantity})</span>
                                                </>
                                              ) : (
                                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                                  Suggestion
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}

                                    {/* Show "Add new" option if no matches */}
                                    {Object.keys(objects).filter(objectName =>
                                      objectName.toLowerCase().includes(newObjectInputs[roomId].toLowerCase())
                                    ).length === 0 && (
                                        <div
                                          className="p-3 cursor-pointer hover:bg-slate-50 border-b border-slate-100"
                                          onClick={() => {
                                            addNewObjectToRoom(roomId, newObjectInputs[roomId]);
                                            setNewObjectInputs(prev => ({
                                              ...prev,
                                              [roomId]: ''
                                            }));
                                          }}
                                        >
                                          <div className="flex items-center gap-2">
                                            <Plus className="w-4 h-4 text-[#CC922F]" />
                                            <span className="font-medium text-[#CC922F]">
                                              Ajouter "{newObjectInputs[roomId]}"
                                            </span>
                                          </div>
                                        </div>
                                      )}
                                  </div>
                                )}
                              </div>

                              <div className="flex gap-2 mt-3">
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    if (newObjectInputs[roomId]?.trim()) {
                                      addNewObjectToRoom(roomId, newObjectInputs[roomId].trim());
                                      setNewObjectInputs(prev => ({
                                        ...prev,
                                        [roomId]: ''
                                      }));
                                    }
                                  }}
                                  className="bg-[#1c3957] hover:bg-[#1c3957]/90 text-white"
                                >
                                  Ajouter
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="max-w-4xl mx-auto mb-8">
                      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mr-4">
                            <AlertCircle className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-red-800">Erreur d'analyse</h3>
                            <p className="text-red-600">Impossible d'analyser vos photos</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}


                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <Button
                      onClick={() => {
                        // Reset analysis state to allow re-analysis
                        setAnalysisResults(null);
                        setIsAnalyzing(false);
                        setAnalysisProgress(0);
                        setRoomAnalysisResults({});
                        // Clear all uploaded images to start fresh
                        setUploadedImages([]);
                        // Navigate back to AI method page
                        navigate("/tunnel/mon-volume/ai");
                      }}
                      className="flex items-center gap-2 bg-[#1c3957] hover:bg-[#1c3957]/90 text-white"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      RETOUR
                    </Button>
                    <Button
                      className="bg-[#1c3957] hover:bg-[#1c3957]/90 text-white flex-1"
                      onClick={() => navigate("/tunnel/adresses")}
                    >
                      CONTINUER →
                    </Button>
                  </div>
                </>
              )}

              {currentPage === "addresses" && (
                <>
                  {/* Sophie's Profile - Addresses Page */}
                  <div className="flex flex-col sm:flex-row items-start gap-4 mb-6">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden flex-shrink-0">
                      <ImageWithFallback
                        src="/sophie.jpeg"
                        alt="Sophie"
                        className="w-full h-full object-cover"
                        style={{ transform: 'scale(1.2)' }}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-lg font-semibold text-slate-900 mb-1">
                        Sophie
                      </p>
                      <p className="text-primary text-sm">
                        Pouvez-vous m'en dire un peu plus sur les adresses ? Départ, arrivée et éventuelles étapes intermédiaires.
                      </p>
                    </div>
                  </div>

                  {/* Departure Section */}
                  <div className="mb-6 sm:mb-8 border-2 border-slate-200 rounded-lg p-4 sm:p-6 bg-white">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                        <MapPin className="w-5 h-5" style={{ color: '#CC922F' }} />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        Au départ
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label className="text-slate-900 mb-2 block">
                          Ville ou adresse complète
                        </Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 z-10 pointer-events-none" style={{ color: '#CC922F' }} />
                          <AddressAutocomplete
                            value={addressData.departure.address}
                            onChange={(v) => updateAddressData("departure", "address", v)}
                            placeholder="Ville ou adresse complète"
                            className="bg-slate-50 border-slate-200 pl-12"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-slate-900 mb-2 block">Étage</Label>
                          <Select
                            value={addressData.departure.floor}
                            onValueChange={(value) => {
                              updateAddressData("departure", "floor", value);
                              
                              // If floor is RDC, force monte-meuble to false
                              if (value === "RDC") {
                                updateAddressOption("departure", "monteMenuble", false);
                              }
                              // If floor is not RDC and elevator is Non, automatically enable monte-meuble
                              else if (addressData.departure.elevator === "Non") {
                                updateAddressOption("departure", "monteMenuble", true);
                              }
                            }}
                          >
                            <SelectTrigger className="bg-slate-50 border-slate-200">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-slate-200 shadow-lg">
                              <SelectItem value="RDC">RDC</SelectItem>
                              <SelectItem value="1">1</SelectItem>
                              <SelectItem value="2">2</SelectItem>
                              <SelectItem value="3">3</SelectItem>
                              <SelectItem value="4">4</SelectItem>
                              <SelectItem value="5">5</SelectItem>
                              <SelectItem value="6">6</SelectItem>
                              <SelectItem value="7">7</SelectItem>
                              <SelectItem value="8">8</SelectItem>
                              <SelectItem value="9">9</SelectItem>
                              <SelectItem value="10">10</SelectItem>
                              <SelectItem value="11">11</SelectItem>
                              <SelectItem value="12">12</SelectItem>
                              <SelectItem value="13">13</SelectItem>
                              <SelectItem value="14">14</SelectItem>
                              <SelectItem value="15">15</SelectItem>
                              <SelectItem value="16">16</SelectItem>
                              <SelectItem value="17">17</SelectItem>
                              <SelectItem value="18">18</SelectItem>
                              <SelectItem value="19">19</SelectItem>
                              <SelectItem value="20">20</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-slate-900 mb-2 block">Ascenseur</Label>
                          <Select
                            value={addressData.departure.elevator}
                            onValueChange={(value) => {
                              updateAddressData("departure", "elevator", value);
                              // If elevator selected (not "Non"), uncheck monte-meuble
                              if (value !== "Non") {
                                updateAddressOption("departure", "monteMenuble", false);
                              }
                              // If elevator is "Non" and floor is not "RDC", automatically enable monte-meuble
                              else if (addressData.departure.floor !== "RDC") {
                                updateAddressOption("departure", "monteMenuble", true);
                              }
                              // Reset demi-étage when elevator is set to "Non"
                              if (value === "Non") {
                                updateAddressData("departure", "demiEtage", false);
                              }
                            }}
                            disabled={addressData.departure.floor === "RDC"}
                          >
                            <SelectTrigger className="bg-slate-50 border-slate-200">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-slate-200 shadow-lg">
                              <SelectItem value="Non">Non</SelectItem>
                              <SelectItem value="2-3 personnes">2-3 personnes</SelectItem>
                              <SelectItem value="3-4 personnes">3-4 personnes</SelectItem>
                              <SelectItem value="4-6 personnes">4-6 personnes</SelectItem>
                              <SelectItem value="6-8 personnes ou plus">6-8 personnes ou plus</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      {addressData.departure.elevator !== "Non" && (
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="departure-demi-etage"
                            checked={addressData.departure.demiEtage}
                            onCheckedChange={(checked) =>
                              updateAddressData("departure", "demiEtage", checked as boolean)
                            }
                            className="data-[state=checked]:bg-[#1c3957] data-[state=unchecked]:bg-slate-200 shrink-0"
                          />
                          <Label htmlFor="departure-demi-etage" className="text-sm text-slate-600">
                            Dans les étages sélectionnés, y a-t-il un ascenseur desservant uniquement un demi-étage ?
                          </Label>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="departure-monte-meuble"
                            checked={addressData.departure.options.monteMenuble}
                            onCheckedChange={(checked) => {
                              updateAddressOption("departure", "monteMenuble", checked as boolean);
                              // If monte-meuble selected, reset elevator to "Non"
                              if (checked) {
                                updateAddressData("departure", "elevator", "Non");
                              }
                            }}
                            disabled={addressData.departure.floor === "RDC"}
                            className="data-[state=checked]:bg-[#1c3957] data-[state=unchecked]:bg-slate-200"
                          />
                          <Label htmlFor="departure-monte-meuble" className="text-sm">
                            Monte-meuble
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="departure-cave-garage"
                            checked={addressData.departure.options.caveGarage}
                            onCheckedChange={(checked) =>
                              updateAddressOption("departure", "caveGarage", checked as boolean)
                            }
                            className="data-[state=checked]:bg-[#1c3957] data-[state=unchecked]:bg-slate-200"
                          />
                          <Label htmlFor="departure-cave-garage" className="text-sm">
                            Cave ou garage
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="departure-cour-traverser"
                            checked={addressData.departure.options.courTraverser}
                            onCheckedChange={(checked) =>
                              updateAddressOption("departure", "courTraverser", checked as boolean)
                            }
                            className="data-[state=checked]:bg-[#1c3957] data-[state=unchecked]:bg-slate-200"
                          />
                          <Label htmlFor="departure-cour-traverser" className="text-sm">
                            Cour à traverser
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 flex-wrap gap-2">
                          <Label htmlFor="departure-distance-portage" className="text-sm">
                            Distance de portage *
                          </Label>
                          <div className="flex items-center gap-1.5">
                            <Input
                              type="number"
                              min={0}
                              step={1}
                              placeholder="m"
                              value={addressData.departure.options.portageDistanceM ?? ""}
                              onChange={(e) => {
                                const v = e.target.value === "" ? 0 : parseFloat(e.target.value);
                                updateAddressOption("departure", "portageDistanceM", isNaN(v) ? 0 : v);
                              }}
                              className="w-20 h-8 text-sm bg-slate-50 border-slate-200"
                              required
                            />
                            <span className="text-xs text-slate-500">m</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Escales Sections */}
                  {escales.map((escale, index) => (
                    <div key={escale.id} className="mb-6 sm:mb-8 border-2 border-slate-200 rounded-lg p-4 sm:p-6 bg-white">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                            <MapPin className="w-5 h-5" style={{ color: '#CC922F' }} />
                          </div>
                          <h3 className="text-lg font-semibold text-slate-900">
                            Escale n°{index + 1}
                          </h3>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                          onClick={() => removeEscale(escale.id)}
                        >
                          <Trash2 className="w-4 h-4" style={{ color: '#CC922F' }} />
                          supp.
                        </Button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label className="text-slate-900 mb-2 block">
                            Ville ou adresse complète
                          </Label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 z-10 pointer-events-none" style={{ color: '#CC922F' }} />
                            <AddressAutocomplete
                              value={escale.address}
                              onChange={(v) => updateEscaleData(escale.id, "address", v)}
                              placeholder="Quelle adresse pour l'escale ?"
                              className="bg-slate-50 border-slate-200 pl-12"
                            />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-slate-900 mb-2 block">Étage</Label>
                            <Select
                              value={escale.floor}
                              onValueChange={(value) =>
                                updateEscaleData(escale.id, "floor", value)
                              }
                            >
                              <SelectTrigger className="bg-slate-50 border-slate-200">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-white border border-slate-200 shadow-lg">
                                <SelectItem value="RDC">RDC</SelectItem>
                                <SelectItem value="1">1</SelectItem>
                                <SelectItem value="2">2</SelectItem>
                                <SelectItem value="3">3</SelectItem>
                                <SelectItem value="4">4</SelectItem>
                                <SelectItem value="5">5</SelectItem>
                                <SelectItem value="6">6</SelectItem>
                                <SelectItem value="7">7</SelectItem>
                                <SelectItem value="8">8</SelectItem>
                                <SelectItem value="9">9</SelectItem>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="11">11</SelectItem>
                                <SelectItem value="12">12</SelectItem>
                                <SelectItem value="13">13</SelectItem>
                                <SelectItem value="14">14</SelectItem>
                                <SelectItem value="15">15</SelectItem>
                                <SelectItem value="16">16</SelectItem>
                                <SelectItem value="17">17</SelectItem>
                                <SelectItem value="18">18</SelectItem>
                                <SelectItem value="19">19</SelectItem>
                                <SelectItem value="20">20</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-slate-900 mb-2 block">Ascenseur</Label>
                            <Select
                              value={escale.elevator}
                              onValueChange={(value) => {
                                updateEscaleData(escale.id, "elevator", value);
                                // If elevator selected (not "Non"), uncheck monte-meuble
                                if (value !== "Non") {
                                  updateEscaleOption(escale.id, "monteMenuble", false);
                                }
                                // Reset demi-étage when elevator is set to "Non"
                                if (value === "Non") {
                                  updateEscaleData(escale.id, "demiEtage", false);
                                }
                              }}
                            >
                              <SelectTrigger className="bg-slate-50 border-slate-200">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-white border border-slate-200 shadow-lg">
                                <SelectItem value="Non">Non</SelectItem>
                                <SelectItem value="2-3 personnes">2-3 personnes</SelectItem>
                                <SelectItem value="3-4 personnes">3-4 personnes</SelectItem>
                                <SelectItem value="4-6 personnes">4-6 personnes</SelectItem>
                                <SelectItem value="6-8 personnes ou plus">6-8 personnes ou plus</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        {escale.elevator !== "Non" && (
                          <div className="flex items-center space-x-2">
                            <Switch
                              id={`escale-${escale.id}-demi-etage`}
                              checked={escale.demiEtage}
                              onCheckedChange={(checked) =>
                                updateEscaleData(escale.id, "demiEtage", checked as boolean)
                              }
                              className="data-[state=checked]:bg-[#1c3957] data-[state=unchecked]:bg-slate-200 shrink-0"
                            />
                            <Label htmlFor={`escale-${escale.id}-demi-etage`} className="text-sm text-slate-600">
                              Dans les étages sélectionnés, y a-t-il un ascenseur desservant uniquement un demi-étage ?
                            </Label>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center space-x-2">
                            <Switch
                              id={`escale-${escale.id}-monte-meuble`}
                              checked={escale.options.monteMenuble}
                              onCheckedChange={(checked) => {
                                updateEscaleOption(escale.id, "monteMenuble", checked as boolean);
                                // If monte-meuble selected, reset elevator to "Non"
                                if (checked) {
                                  updateEscaleData(escale.id, "elevator", "Non");
                                }
                              }}
                              className="data-[state=checked]:bg-[#1c3957] data-[state=unchecked]:bg-slate-200"
                            />
                            <Label htmlFor={`escale-${escale.id}-monte-meuble`} className="text-sm">
                              Monte-meuble
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id={`escale-${escale.id}-cave-garage`}
                              checked={escale.options.caveGarage}
                              onCheckedChange={(checked) =>
                                updateEscaleOption(escale.id, "caveGarage", checked as boolean)
                              }
                              className="data-[state=checked]:bg-[#1c3957] data-[state=unchecked]:bg-slate-200"
                            />
                            <Label htmlFor={`escale-${escale.id}-cave-garage`} className="text-sm">
                              Cave ou garage
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id={`escale-${escale.id}-cour-traverser`}
                              checked={escale.options.courTraverser}
                              onCheckedChange={(checked) =>
                                updateEscaleOption(escale.id, "courTraverser", checked as boolean)
                              }
                              className="data-[state=checked]:bg-[#1c3957] data-[state=unchecked]:bg-slate-200"
                            />
                            <Label htmlFor={`escale-${escale.id}-cour-traverser`} className="text-sm">
                              Cour à traverser
                            </Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Add Escale Button */}
                  <div className="mb-8 text-center">
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 text-primary mx-auto"
                      onClick={addEscale}
                    >
                      <Plus className="w-4 h-4" style={{ color: '#CC922F' }} />
                      Ajouter une Escale
                    </Button>
                  </div>

                  {/* Arrival Section */}
                  <div className="mb-6 sm:mb-8 border-2 border-slate-200 rounded-lg p-4 sm:p-6 bg-white">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5" style={{ color: '#CC922F' }} />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        À l'arrivée
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label className="text-slate-900 mb-2 block">
                          Ville ou adresse complète
                        </Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 z-10 pointer-events-none" style={{ color: '#CC922F' }} />
                          <AddressAutocomplete
                            value={addressData.arrival.address}
                            onChange={(v) => updateAddressData("arrival", "address", v)}
                            placeholder="Quel point d'arrivée ?"
                            className="bg-slate-50 border-slate-200 pl-12"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-slate-900 mb-2 block">Étage</Label>
                          <Select
                            value={addressData.arrival.floor}
                            onValueChange={(value) => {
                              updateAddressData("arrival", "floor", value);
                              
                              // If floor is RDC, force monte-meuble to false
                              if (value === "RDC") {
                                updateAddressOption("arrival", "monteMenuble", false);
                              }
                              // If floor is not RDC and elevator is Non, automatically enable monte-meuble
                              else if (addressData.arrival.elevator === "Non") {
                                updateAddressOption("arrival", "monteMenuble", true);
                              }
                            }}
                          >
                            <SelectTrigger className="bg-slate-50 border-slate-200">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-slate-200 shadow-lg">
                              <SelectItem value="RDC">RDC</SelectItem>
                              <SelectItem value="1">1</SelectItem>
                              <SelectItem value="2">2</SelectItem>
                              <SelectItem value="3">3</SelectItem>
                              <SelectItem value="4">4</SelectItem>
                              <SelectItem value="5">5</SelectItem>
                              <SelectItem value="6">6</SelectItem>
                              <SelectItem value="7">7</SelectItem>
                              <SelectItem value="8">8</SelectItem>
                              <SelectItem value="9">9</SelectItem>
                              <SelectItem value="10">10</SelectItem>
                              <SelectItem value="11">11</SelectItem>
                              <SelectItem value="12">12</SelectItem>
                              <SelectItem value="13">13</SelectItem>
                              <SelectItem value="14">14</SelectItem>
                              <SelectItem value="15">15</SelectItem>
                              <SelectItem value="16">16</SelectItem>
                              <SelectItem value="17">17</SelectItem>
                              <SelectItem value="18">18</SelectItem>
                              <SelectItem value="19">19</SelectItem>
                              <SelectItem value="20">20</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-slate-900 mb-2 block">Ascenseur</Label>
                          <Select
                            value={addressData.arrival.elevator}
                            onValueChange={(value) => {
                              updateAddressData("arrival", "elevator", value);
                              // If elevator selected (not "Non"), uncheck monte-meuble
                              if (value !== "Non") {
                                updateAddressOption("arrival", "monteMenuble", false);
                              }
                              // If elevator is "Non" and floor is not "RDC", automatically enable monte-meuble
                              else if (addressData.arrival.floor !== "RDC") {
                                updateAddressOption("arrival", "monteMenuble", true);
                              }
                              // Reset demi-étage when elevator is set to "Non"
                              if (value === "Non") {
                                updateAddressData("arrival", "demiEtage", false);
                              }
                            }}
                            disabled={addressData.arrival.floor === "RDC"}
                          >
                            <SelectTrigger className="bg-slate-50 border-slate-200">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-slate-200 shadow-lg">
                              <SelectItem value="Non">Non</SelectItem>
                              <SelectItem value="2-3 personnes">2-3 personnes</SelectItem>
                              <SelectItem value="3-4 personnes">3-4 personnes</SelectItem>
                              <SelectItem value="4-6 personnes">4-6 personnes</SelectItem>
                              <SelectItem value="6-8 personnes ou plus">6-8 personnes ou plus</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      {addressData.arrival.elevator !== "Non" && (
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="arrival-demi-etage"
                            checked={addressData.arrival.demiEtage}
                            onCheckedChange={(checked) =>
                              updateAddressData("arrival", "demiEtage", checked as boolean)
                            }
                            className="data-[state=checked]:bg-[#1c3957] data-[state=unchecked]:bg-slate-200 shrink-0"
                          />
                          <Label htmlFor="arrival-demi-etage" className="text-sm text-slate-600">
                            Dans les étages sélectionnés, y a-t-il un ascenseur desservant uniquement un demi-étage ?
                          </Label>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="arrival-monte-meuble"
                            checked={addressData.arrival.options.monteMenuble}
                            onCheckedChange={(checked) => {
                              updateAddressOption("arrival", "monteMenuble", checked as boolean);
                              // If monte-meuble selected, reset elevator to "Non"
                              if (checked) {
                                updateAddressData("arrival", "elevator", "Non");
                              }
                            }}
                            disabled={addressData.arrival.floor === "RDC"}
                            className="data-[state=checked]:bg-[#1c3957] data-[state=unchecked]:bg-slate-200"
                          />
                          <Label htmlFor="arrival-monte-meuble" className="text-sm">
                            Monte-meuble
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="arrival-cave-garage"
                            checked={addressData.arrival.options.caveGarage}
                            onCheckedChange={(checked) =>
                              updateAddressOption("arrival", "caveGarage", checked as boolean)
                            }
                            className="data-[state=checked]:bg-[#1c3957] data-[state=unchecked]:bg-slate-200"
                          />
                          <Label htmlFor="arrival-cave-garage" className="text-sm">
                            Cave ou garage
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="arrival-cour-traverser"
                            checked={addressData.arrival.options.courTraverser}
                            onCheckedChange={(checked) =>
                              updateAddressOption("arrival", "courTraverser", checked as boolean)
                            }
                            className="data-[state=checked]:bg-[#1c3957] data-[state=unchecked]:bg-slate-200"
                          />
                          <Label htmlFor="arrival-cour-traverser" className="text-sm">
                            Cour à traverser
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 flex-wrap gap-2">
                          <Label htmlFor="arrival-distance-portage" className="text-sm">
                            Distance de portage *
                          </Label>
                          <div className="flex items-center gap-1.5">
                            <Input
                              type="number"
                              min={0}
                              step={1}
                              placeholder="m"
                              value={addressData.arrival.options.portageDistanceM ?? ""}
                              onChange={(e) => {
                                const v = e.target.value === "" ? 0 : parseFloat(e.target.value);
                                updateAddressOption("arrival", "portageDistanceM", isNaN(v) ? 0 : v);
                              }}
                              className="w-20 h-8 text-sm bg-slate-50 border-slate-200"
                              required
                            />
                            <span className="text-xs text-slate-500">m</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={handleBackToCleaning}
                      className="flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" style={{ color: '#CC922F' }} />
                      RETOUR
                    </Button>
                    <Button
                      className="bg-[#1c3957] hover:bg-[#1c3957]/90 text-white flex-1"
                      onClick={handleContinueToQuote}
                      disabled={!addressData.departure.address?.trim() || !addressData.arrival.address?.trim()}
                    >
                      Continuer →
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:space-y-12">
            {/* Mes étapes */}
            <div className="hidden lg:block bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2 sm:mb-4">
                Mes étapes
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6">
                Étape {currentStepNumber} sur 3 - gardez le cap, vous y êtes presque.
              </p>
              <ul className="relative space-y-4 sm:space-y-5">
                <div className="absolute left-[15px] sm:left-[17px] top-2 bottom-2 w-[2px] bg-slate-200" />
                {stepItems.map((item) => {
                  const isCompleted = currentStepNumber > item.step;
                  const isCurrent = currentStepNumber === item.step;
                  const dotClass = isCompleted
                    ? "bg-emerald-500 border-emerald-500 text-white"
                    : isCurrent
                      ? "bg-white border-[#1c3957] text-[#1c3957]"
                      : "bg-white border-slate-300 text-slate-400";
                  const cardClass = isCurrent
                    ? "border-[#1c3957] bg-[#1c3957]/5"
                    : "border-slate-200 bg-white";

                  return (
                    <li key={item.step} className="relative flex items-start gap-3 sm:gap-4 min-w-0">
                      <div className={`relative z-10 mt-0.5 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border-2 text-xs font-semibold ${dotClass}`}>
                        {isCompleted ? <Check className="w-4 h-4" /> : item.step}
                      </div>
                      <div className={`flex-1 rounded-lg border p-3 sm:p-4 ${cardClass}`}>
                        <p className={`text-sm sm:text-base font-semibold ${isCurrent ? "text-slate-900" : "text-slate-700"}`}>
                          Étape {item.step} - {item.title}
                        </p>
                        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                          {item.subtitle}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Trust Indicators */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
              <div className="flex items-center text-base">
                <div className="flex items-center justify-center mr-3">
                  <Heart className="w-8 h-8 font-bold" style={{ color: '#CC922F' }} />
                </div>
                <span className="text-slate-900">
                  +100 000 clients satisfaits depuis 2011
                </span>
              </div>
              <div className="flex items-center text-base">
                <div className="flex items-center justify-center mr-3">
                  <Users className="w-8 h-8 font-bold" style={{ color: '#CC922F' }} />
                </div>
                <span className="text-slate-900">
                  Déménageurs professionnels suivis
                </span>
              </div>
              <div className="flex items-center text-base">
                <div className="flex items-center justify-center mr-3">
                  <Clock className="w-8 h-8 font-bold" style={{ color: '#CC922F' }} />
                </div>
                <span className="text-slate-900">
                  Service client 7j/7 de 9h à 18h
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Trust Badges */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="flex items-center justify-center bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-center mr-4">
              <Check className="w-10 h-10 font-bold" style={{ color: '#CC922F' }} />
            </div>
            <div>
              <div className="font-medium text-slate-900 text-lg">Gratuit et sans</div>
              <div className="font-medium text-slate-900 text-lg">engagement</div>
            </div>
          </div>
          <div className="flex items-center justify-center bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-center mr-4">
              <Shield className="w-10 h-10 font-bold" style={{ color: '#CC922F' }} />
            </div>
            <div>
              <div className="font-medium text-slate-900 text-lg">RGPD</div>
              <div className="font-medium text-slate-900 text-lg">Respecté</div>
            </div>
          </div>
          <div className="flex items-center justify-center bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-center mr-4">
              <Clock className="w-10 h-10 font-bold" style={{ color: '#CC922F' }} />
            </div>
            <div>
              <div className="font-medium text-slate-900 text-lg">Devis</div>
              <div className="font-medium text-slate-900 text-lg">instantané</div>
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <div className="mt-8 text-xs text-slate-500 leading-relaxed">
          <p>
            Guivarche est une société française de services de déménagement professionnel fondée en 2018. Nous sommes
            entièrement agréés, assurés et cautionnés. Notre équipe de déménageurs professionnels certifiés
            subit des vérifications d'antécédents approfondies et une formation approfondie pour garantir un
            service de la plus haute qualité. Guivarche s'engage à utiliser des techniques de déménagement modernes et
            à maintenir les normes les plus élevées de sécurité et de satisfaction client.
          </p>
        </div>
      </div>
    </div>
  );
}

function shouldUseTrailingSlash(pathname: string): boolean {
  return pathname !== "/" && !pathname.startsWith("/tunnel");
}

function AppRoutes() {
  const location = useLocation();
  const { pathname, search, hash } = location;

  if (shouldUseTrailingSlash(pathname) && !pathname.endsWith("/")) {
    return <Navigate to={`${pathname}/${search}${hash}`} replace />;
  }

  const matchPath = pathname.endsWith("/") && pathname !== "/"
    ? pathname.replace(/\/+$/, "")
    : pathname;
  const routeLocation =
    matchPath === pathname ? location : { ...location, pathname: matchPath };

  return (
    <Routes location={routeLocation}>
        <Route path="/" element={<HomePage />} />
        <Route path="/demenagement-ile-de-france" element={<ZoneIleDeFrance />} />
        <Route path="/versaille" element={<Navigate to="/demenagement-paris-versaille" replace />} />
        <Route path="/demenagement-paris-versaille" element={<Versaille />} />
        <Route path="/longue" element={<LongueDistanceSeo />} />
        <Route path="/lp/paris" element={<Paris />} />
        <Route path="/lp/hauts-de-seine" element={<Seine92 />} />
        <Route path="/lp/longue-distance" element={<LongueDistance />} />
        <Route path="/lp/pro" element={<Pro />} />
        <Route path="/lp/particulier" element={<Particulier />} />
        <Route path="/demenagement-national" element={<ZoneNational />} />
        <Route path="/demenagement-international" element={<ZoneInternational />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/solution" element={<Solution />} />
        <Route path="/en-construction" element={<EnConstruction />} />
        <Route path="/demenagement-entreprise" element={<DemenagementEntreprise />} />
        <Route path="/demenagement-particulier" element={<DemenagementParticulier />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogArticle />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/tarif" element={<Tarification />} />
        <Route path="/formules-demenagement" element={<FormulesDemenagement />} />
        <Route path="/mentions-legales" element={<MentionsLegales />} />
        <Route path="/rgpd" element={<Rgpd />} />
        <Route path="/tunnel/mes-coordonnees" element={<AppContent />} />
        <Route path="/tunnel/choix-volume" element={
          <RouteGuard>
            <AppContent />
          </RouteGuard>
        } />
        <Route path="/tunnel/mon-volume" element={<Navigate to="/tunnel/choix-volume" replace />} />
        <Route path="/tunnel/mon-volume/liste" element={
          <RouteGuard>
            <AppContent />
          </RouteGuard>
        } />
        <Route path="/tunnel/mon-volume/ai" element={
          <RouteGuard>
            <AppContent />
          </RouteGuard>
        } />
        <Route path="/tunnel/mon-volume/surface" element={
          <RouteGuard>
            <AppContent />
          </RouteGuard>
        } />
        <Route path="/tunnel/ai-results" element={
          <RouteGuard>
            <AppContent />
          </RouteGuard>
        } />
        <Route path="/tunnel/adresses" element={
          <RouteGuard>
            <AppContent />
          </RouteGuard>
        } />
        <Route path="/tunnel/devis" element={
          <RouteGuard>
            <AppContent />
          </RouteGuard>
        } />
        <Route path="/tunnel/devis/confirmation" element={
          <RouteGuard>
            <AppContent />
          </RouteGuard>
        } />
        <Route path="/tunnel/info" element={
          <RouteGuard>
            <AppContent />
          </RouteGuard>
        } />
        <Route path="/tunnel/options" element={
          <RouteGuard>
            <AppContent />
          </RouteGuard>
        } />
        <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <DevisEntryTracker />
      <StickyContactButtons />
      <AppRoutes />
    </Router>
  );
}

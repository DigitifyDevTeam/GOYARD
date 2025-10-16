import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import RouteGuard from "./components/RouteGuard";
import ScrollToTop from "./components/ScrollToTop";
import { FormDataManager } from "./utils/formDataManager";
import HomePage from "./pages/HomeDesigned";
import Contact from "./pages/Contact";
import MentionsLegales from "./pages/MentionsLegales";
import Rgpd from "./pages/Rgpd";
import Solution from "./pages/Solution";
import Blog from "./pages/Blog";
import BlogArticle from "./pages/BlogArticle";
import FAQ from "./pages/FAQ";
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
  Shirt,
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
  X,
} from "lucide-react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { Checkbox } from "./components/ui/checkbox";
import { Slider } from "./components/ui/slider";
import { Switch } from "./components/ui/switch";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";

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
    if (existingData.firstName || existingData.lastName || existingData.email || existingData.phone) {
      setFormData(prev => ({
        ...prev,
        firstName: existingData.firstName || '',
        name: existingData.lastName || '',
        email: existingData.email || '',
        phone: existingData.phone || '',
        address: existingData.address || '',
        date: existingData.date || prev.date
      }));
    }

    // Check if user has already submitted form (has clientId)
    const storedClientId = localStorage.getItem('clientId');
    if (storedClientId) {
      setClientId(parseInt(storedClientId));
    }
  }, []);
  
  const [propertyValue, setPropertyValue] = useState(27000);
  const [selectedGuarantee, setSelectedGuarantee] = useState("1000");
  const [options, setOptions] = useState({
    packCartons: false,
    dateFlexible: false,
    prixFlexible: false,
    demontageRemontage: false,
    emballageFragile: false,
    emballageCartons: false,
    autorisationStationnement: false,
    transportVetements: false,
  });
  const [formData, setFormData] = useState({
    address: "",
    date: "2025-12-25", // Future date in YYYY-MM-DD format
    name: "",
    firstName: "",
    email: "",
    phone: "",
  });
  const [clientId, setClientId] = useState<number | null>(null);

  const [selectedRoom, setSelectedRoom] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [surfaceArea, setSurfaceArea] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<"list" | "photo" | "surface" | null>(getSelectedMethodFromUrl());
  const [lastUsedMethod, setLastUsedMethod] = useState<"list" | "photo" | "surface" | null>(null);
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
  const [roomAnalysisResults, setRoomAnalysisResults] = useState<Record<string, Record<string, number>>>({});
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
      options: {
        monteMenuble: false,
        caveGarage: false,
        courTraverser: false,
      },
    },
    arrival: {
      address: "Lyon, France",
      floor: "RDC",
      elevator: "Non",
      options: {
        monteMenuble: false,
        caveGarage: false,
        courTraverser: false,
      },
    },
    preferStorage: false,
  });

  const [escales, setEscales] = useState<Array<{
    id: number;
    address: string;
    floor: string;
    elevator: string;
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
    // Validate required fields with specific messages
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
    if (!formData.address.trim()) {
      alert('L\'adresse de départ est obligatoire');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Veuillez entrer une adresse email valide');
      return;
    }

    // Validate phone number (French format: 10 digits starting with 0)
    const phoneClean = formData.phone.replace(/[\s\-\.\(\)]/g, '');
    if (phoneClean.length !== 10) {
      alert('Le numéro de téléphone doit contenir exactement 10 chiffres');
      return;
    }
    if (!/^0[0-9]{9}$/.test(phoneClean)) {
      alert('Le numéro de téléphone doit commencer par 0 et être au format français (ex: 0123456789)');
      return;
    }

    // Save complete form data for route protection
    FormDataManager.saveFormData({
      firstName: formData.firstName.trim(),
      lastName: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      date: formData.date
    });

    // Validate address length
    if (formData.address.trim().length < 10) {
      alert('L\'adresse doit contenir au moins 10 caractères pour être valide');
      return;
    }

    // Validate date (must be in the future)
    const today = new Date();
    const selectedDate = new Date(formData.date);
    if (selectedDate <= today) {
      alert('La date de déménagement doit être dans le futur (après aujourd\'hui)');
      return;
    }

    try {
      // Prepare client information data
      const clientData = {
        nom: formData.name.trim(),
        prenom: formData.firstName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        adresse_depart: formData.address.trim(),
        date_demenagement: formData.date // Format: YYYY-MM-DD
      };

      console.log('Submitting client information:', clientData);

      const response = await fetch('http://127.0.0.1:8000/api/demenagement/client-info/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData)
      });

      const result = await response.json();

      if (result.success) {
        console.log('Client information saved successfully:', result.data);
        // Store client ID for later use
        setClientId(result.data.id);
        
        // Mark form as completed for route protection
        FormDataManager.markFormSubmitted(result.data.id);
        
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
      navigate("/tunnel/mon-volume/surface");
    } else if (method === "photo") {
      navigate("/tunnel/mon-volume/ai");
    }
  };

  const handleContinueFromSurface = async () => {
    try {
      // Calculate volumes using the formulas
      const area = parseFloat(surfaceArea);
      const vhouse = area * 2.5; // vhouse = x * 2.5
      const vfurniture = 40; // vfurniture = 500 * 0.08 = 40 m³
      const totalVolume = vhouse + vfurniture;
      
      console.log('Superficie calculation:', {
        area: area,
        vhouse: vhouse,
        vfurniture: vfurniture,
        totalVolume: totalVolume
      });

      // Prepare API payload for superficie method
      const payload = {
        client_info: clientId,
        method: "superficie",
        surface_area: area,
        calculated_volumes: {
          vhouse: vhouse,
          vfurniture: vfurniture,
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
      const response = await fetch('http://127.0.0.1:8000/api/demenagement/superficie/', {
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

  const handlePreviousRoom = () => {
    const currentIndex = rooms.indexOf(selectedRoom || rooms[0]);
    if (currentIndex > 0) {
      setSelectedRoom(rooms[currentIndex - 1]);
    }
  };

  const handleNextRoom = () => {
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

      const response = await fetch('http://localhost:8000/api/check-duplicates/', {
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

        const response = await fetch('http://localhost:8000/api/predict/', {
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
      custom_rooms: uniqueCustomRooms,  // Include custom rooms in combined results
      individual_results: results
    };
  };

  const handleContinueToAddresses = () => {
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
      Object.entries(roomObjectQuantities).forEach(([roomName, objects]) => {
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
          
          const backendRoomName = roomMapping[roomName] || "autre";
          
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
      Object.entries(roomObjectQuantities).forEach(([roomName, objects]) => {
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

      const response = await fetch('http://127.0.0.1:8000/api/demenagement/rooms/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.success) {
        console.log('Manual selection submitted successfully:', result);
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
      const currentQuantity = typeof currentObject === 'number' ? currentObject : currentObject?.quantity || 0;
      const newQuantity = Math.max(0, currentQuantity + change);
      
      return {
        ...prev,
        [roomId]: {
          ...prev[roomId],
          [object]: typeof currentObject === 'object' ? {
            ...currentObject,
            quantity: newQuantity
          } : newQuantity
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
    // Save address data to backend before continuing to quote
    await submitAddressData();
    navigate("/tunnel/devis");
  };

  // Submit address data to API
  const submitAddressData = async () => {
    if (!clientId) {
      console.error('No client ID available');
      return;
    }

    try {
      const addressPayload = {
        client_info: clientId,
        // Departure address
        adresse_depart: addressData.departure.address,
        etage_depart: addressData.departure.floor,
        ascenseur_depart: addressData.departure.elevator,
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
        escale_options: escales.length > 0 ? {
          monte_meuble: escales[0].options.monteMenuble || false,
          cave_ou_garage: escales[0].options.caveGarage || false,
          cours_a_traverser: escales[0].options.courTraverser || false,
        } : {},
        // Arrival address
        adresse_arrivee: addressData.arrival.address,
        etage_arrivee: addressData.arrival.floor,
        ascenseur_arrivee: addressData.arrival.elevator,
        options_arrivee: {
          monte_meuble: addressData.arrival.options.monteMenuble || false,
          cave_ou_garage: addressData.arrival.options.caveGarage || false,
          cours_a_traverser: addressData.arrival.options.courTraverser || false,
        },
      };

      console.log('Submitting address data:', addressPayload);

      const response = await fetch('http://127.0.0.1:8000/api/demenagement/address/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addressPayload),
      });

      const result = await response.json();

      if (result.success) {
        console.log('Address data submitted successfully:', result);
      } else {
        console.error('Error submitting address data:', result);
        alert('Erreur lors de l\'enregistrement des adresses: ' + (result.message || 'Erreur inconnue'));
      }
    } catch (error) {
      console.error('Error submitting address data:', error);
      alert('Erreur lors de l\'enregistrement des adresses');
    }
  };

  const handleBackToAddresses = () => {
    navigate("/tunnel/adresses");
  };

  const handleContinueToInfo = () => {
    navigate("/tunnel/info");
  };

  const handleBackToQuote = () => {
    navigate("/tunnel/devis");
  };

  const handleContinueToOptions = () => {
    navigate("/tunnel/options");
  };

  const handleBackToInfo = () => {
    navigate("/tunnel/info");
  };

  const handleSubmitOptions = () => {
    // Handle final quote submission
    console.log(
      "Final quote submitted with options:",
      options,
      "guarantee:",
      selectedGuarantee,
    );
  };

  const toggleOption = (optionKey: keyof typeof options) => {
    setOptions((prev) => ({
      ...prev,
      [optionKey]: !prev[optionKey],
    }));
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
    value: boolean,
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

  const updateEscaleOption = (id: number, option: string, value: boolean) => {
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
        <path d="M3.17004 7.43945L12 12.5494L20.77 7.46942" stroke="#cc922f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 21.6091V12.5391" stroke="#cc922f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9.92999 2.48L4.59 5.45003C3.38 6.12003 2.39001 7.80001 2.39001 9.18001V14.83C2.39001 16.21 3.38 17.89 4.59 18.56L9.92999 21.53C11.07 22.16 12.94 22.16 14.08 21.53L19.42 18.56C20.63 17.89 21.62 16.21 21.62 14.83V9.18001C21.62 7.80001 20.63 6.12003 19.42 5.45003L14.08 2.48C12.93 1.84 11.07 1.84 9.92999 2.48Z" stroke="#cc922f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M17 13.2396V9.57965L7.51001 4.09961" stroke="#cc922f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <defs>
        <clipPath id="clip0_4418_9499">
          <rect width="24" height="24" fill="white"/>
        </clipPath>
      </defs>
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

  const movingItems = getFilteredObjects().map(obj => ({
    name: obj,
    icon: <BoxIcon />
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


  const dateOptions = [
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

  // Show quote page, info page and options page differently - full width
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
              <h1 className="text-3xl font-bold text-slate-900">
                Go
                <span className="bg-gradient-to-r from-[#CC922F] to-[#1c3957] text-white px-3 py-2 rounded ml-1">
                  YARD
                </span>
              </h1>
            </div>
            <div className="flex items-center bg-[#1c3957] text-white px-4 py-2 rounded-full">
              <Phone className="w-4 h-4 mr-2" style={{ color: '#CC922F' }} />
              <span className="text-sm font-medium">
                09 74 50 50 47
              </span>
              <span className="text-xs ml-2 opacity-90">
                Numéro non surtaxé
              </span>
            </div>
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
                  Toutes les prestations de déménagement professionnel avec Des bras en plus comprennent
                </h1>
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
                    Une équipe dévouée et suivie, issue du réseau Des bras en plus
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

              {/* Property Value Section */}
              <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
                <h2 className="text-xl font-semibold text-slate-900 mb-6">
                  Quelle est la valeur des biens transportés ?
                </h2>

                <div className="max-w-2xl mx-auto">
                  <div className="text-3xl font-bold text-slate-900 mb-8">
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
                  <ArrowLeft className="w-4 h-4 style={{ color: '#CC922F' }}" />
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
              {/* Guarantee Section */}
              <div className="bg-slate-100 rounded-lg p-8 text-center mb-12">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">
                  Votre garantie par objet
                </h2>
                <p className="text-sm text-slate-600 mb-8 max-w-4xl mx-auto">
                  Indiquez ici le montant maximal de garantie par élément transporté. Si cela ne suffit pas,
                  vous pourrez faire une{" "}
                  <span className="underline text-primary cursor-pointer">
                    déclaration de valeur
                  </span>
                  .
                </p>

                <div className="flex justify-center gap-4">
                  {[
                    { value: "250", label: "250 €" },
                    { value: "500", label: "500 €" },
                    { value: "1000", label: "1000 €" },
                  ].map((guarantee) => (
                    <Button
                      key={guarantee.value}
                      variant={selectedGuarantee === guarantee.value ? "default" : "outline"}
                      onClick={() => setSelectedGuarantee(guarantee.value)}
                      className={`px-8 py-3 ${
                        selectedGuarantee === guarantee.value
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
              <div className="mb-12">
                <h2 className="text-xl font-semibold text-slate-900 text-center mb-8">
                  Choisissez vos options
                </h2>

                <div className="space-y-6">
                  {/* Pack cartons */}
                  <div className="flex items-start gap-4 py-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package className="w-6 h-6 style={{ color: '#CC922F' }}" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-900 mb-1">
                        Vous souhaitez qu'on vous fournisse un pack cartons, bulle et adhésif ?
                      </h3>
                      <p className="text-sm text-slate-600 mb-2">
                        Votre pack, expédié sous 48h, contiendra : 10 cartons standards, 5 cartons
                        livres, 1 film bulles, 1 rouleau adhésif
                      </p>
                    </div>
                    <Switch
                      checked={options.packCartons}
                      onCheckedChange={() => toggleOption("packCartons")}
                    />
                  </div>

                  {/* Date flexible */}
                  <div className="flex items-start gap-4 py-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-6 h-6 style={{ color: '#CC922F' }}" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-900 mb-1">
                        Vous serez peut être amené à modifier la date du déménagement ?
                      </h3>
                      <p className="text-sm text-slate-600">
                        Reporter sans frais une fois la date du déménagement jusque 72h avant
                      </p>
                    </div>
                    <Switch
                      checked={options.dateFlexible}
                      onCheckedChange={() => toggleOption("dateFlexible")}
                    />
                  </div>

                  {/* Prix flexible */}
                  <div className="flex items-start gap-4 py-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 style={{ color: '#CC922F' }}" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-900 mb-1">
                        Vous êtes flexible sur la date de la prestation ?
                      </h3>
                      <p className="text-sm text-slate-600">
                        Économiser sur le prix de votre déménagement en étant flexible sur 14 jours
                      </p>
                    </div>
                    <Switch
                      checked={options.prixFlexible}
                      onCheckedChange={() => toggleOption("prixFlexible")}
                    />
                  </div>

                  {/* Démontage/remontage */}
                  <div className="flex items-start gap-4 py-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Scissors className="w-6 h-6 style={{ color: '#CC922F' }}" />
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

                  {/* Emballage fragile */}
                  <div className="flex items-start gap-4 py-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6 style={{ color: '#CC922F' }}" />
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

                  {/* Emballage cartons */}
                  <div className="flex items-start gap-4 py-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package className="w-6 h-6 style={{ color: '#CC922F' }}" />
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

                  {/* Autorisation stationnement */}
                  <div className="flex items-start gap-4 py-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Truck className="w-6 h-6 style={{ color: '#CC922F' }}" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-900 mb-1">
                        L'autorisation de stationnement pour le camion est recommandée et parfois même
                        obligatoire dans certaines communes. Vous souhaitez que nous fassions les
                        démarches pour vous ?
                      </h3>
                    </div>
                    <Switch
                      checked={options.autorisationStationnement}
                      onCheckedChange={() => toggleOption("autorisationStationnement")}
                    />
                  </div>

                  {/* Transport vêtements */}
                  <div className="flex items-start gap-4 py-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shirt className="w-6 h-6 style={{ color: '#CC922F' }}" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-900 mb-1">
                        Il existe une solution pratique pour transporter vos vêtements sans les
                        froisser. Vous souhaitez qu'on utilise des penderies pour transporter vos
                        vêtements sur cintres ?
                      </h3>
                    </div>
                    <Switch
                      checked={options.transportVetements}
                      onCheckedChange={() => toggleOption("transportVetements")}
                    />
                  </div>
                </div>
              </div>

              {/* Final Quote Section */}
              <div className="text-center mb-8">
                <p className="text-sm text-slate-600 mb-6">
                  Recevoir le devis avec les modifications et options supplémentaires que j'ai ajouté
                </p>

                <Button
                  onClick={handleSubmitOptions}
                  className="bg-[#1c3957] hover:bg-[#1c3957]/90 text-white px-12 py-3 rounded-lg"
                >
                  RECEVOIR MON DEVIS
                </Button>
              </div>

              {/* Back Button */}
              <div className="mt-8">
                <Button
                  variant="outline"
                  onClick={handleBackToInfo}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4 style={{ color: '#CC922F' }}" />
                  RETOUR
                </Button>
              </div>
            </>
          )}

          {currentPage === "quote" && (
            <>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Left Column - Service Summary */}
                <div className="bg-slate-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-6">
                    Mon déménagement
                  </h3>

                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Date</span>
                      <span className="font-medium">mar. 02/09/2025</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-600">Volume déclaré</span>
                      <span className="font-medium">(calculé par inventaire)</span>
                    </div>

                    <div className="pt-4 border-t border-slate-200">
                      <div className="font-medium text-slate-900 mb-3">Départ</div>
                      <div className="flex justify-between mb-2">
                        <span className="text-slate-600">Adresse</span>
                        <span className="font-medium text-right max-w-[200px]">
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
                        <span className="font-medium text-right max-w-[200px]">
                          {addressData.arrival.address}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Étage</span>
                        <span className="font-medium">{addressData.arrival.floor}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200">
                      <div className="font-medium text-slate-900 mb-3">Services inclus</div>
                      <div className="space-y-2">
                        <div className="flex items-center text-xs text-slate-600">
                          <Check className="w-3 h-3 mr-2 style={{ color: '#CC922F' }}" />
                          Démontage et remontage des meubles
                        </div>
                        <div className="flex items-center text-xs text-slate-600">
                          <Check className="w-3 h-3 mr-2 style={{ color: '#CC922F' }}" />
                          Emballage et déballage
                        </div>
                        <div className="flex items-center text-xs text-slate-600">
                          <Check className="w-3 h-3 mr-2 style={{ color: '#CC922F' }}" />
                          Protection des sols et murs
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Quote Summary */}
                <div className="bg-white rounded-lg border border-slate-200 p-6">
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center mx-auto mb-4">
                      <Truck className="w-16 h-16 font-bold" style={{ color: '#CC922F' }} />
                    </div>

                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      Déménagement
                    </h3>
                    <div className="text-3xl font-bold text-slate-900 mb-1">1697.08 €</div>
                    <div className="text-sm text-slate-600">TTC</div>
                  </div>

                  <div className="space-y-3 mb-6 text-sm border-t border-slate-100 pt-4">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Prestation</span>
                      <span className="font-medium">1408.40 €</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">TVA (20%)</span>
                      <span className="font-medium">281.68 €</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                      <span className="font-semibold">Total TTC</span>
                      <span className="font-bold text-lg">1697.08 €</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center text-green-600 text-sm mb-6">
                    <Check className="w-4 h-4 mr-1 style={{ color: '#CC922F' }}" />
                    <span>Éligible au paiement en plusieurs fois</span>
                  </div>

                  <Button className="w-full bg-[#1c3957] hover:bg-[#1c3957]/90 text-white mb-4 py-3">
                    RÉSERVER
                  </Button>

                  <Button variant="link" className="w-full text-primary text-sm p-0 mb-6">
                    J'ai un code client
                  </Button>

                  <div className="space-y-3 text-sm border-t border-slate-100 pt-4">
                    <div className="flex items-center">
                      <Heart className="w-4 h-4 style={{ color: '#CC922F' }} mr-2 flex-shrink-0" />
                      <span className="text-slate-700">+100 000 clients satisfaits depuis 2011</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 style={{ color: '#CC922F' }} mr-2 flex-shrink-0" />
                      <span className="text-slate-700">Déménageurs professionnels suivis</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 style={{ color: '#CC922F' }} mr-2 flex-shrink-0" />
                      <span className="text-slate-700">Service client 7j/7 de 9h à 18h</span>
                    </div>
                    <div className="flex items-center">
                      <Shield className="w-4 h-4 style={{ color: '#CC922F' }} mr-2 flex-shrink-0" />
                      <span className="text-slate-700">Assurance incluse</span>
                    </div>
                  </div>

                  <Button 
                    variant="link" 
                    className="w-full text-slate-600 text-sm p-0 mt-4"
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

              {/* Back Button */}
              <div className="mt-8 flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={handleBackToAddresses}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4 style={{ color: '#CC922F' }}" />
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

              {/* Additional Info Section */}
              <div className="mt-8">
                  <div className="text-center mb-12">
                    <h1 className="text-2xl font-semibold text-slate-900 mb-8 max-w-4xl mx-auto">
                      Toutes les prestations de déménagement professionnel avec Des bras en plus comprennent
                    </h1>
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
                        Une équipe dévouée et suivie, issue du réseau Des bras en plus
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

                  {/* Property Value Section */}
                  <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
                    <h2 className="text-xl font-semibold text-slate-900 mb-8">
                      Quelle est la valeur des biens transportés ?
                    </h2>
                    
                    <div className="text-3xl font-bold text-slate-900 mb-8">
                      {propertyValue.toLocaleString("fr-FR")} €
                    </div>

                    <div className="max-w-2xl mx-auto">
                        <input
                          type="range"
                          min="3000"
                          max="60000"
                          step="3000"
                          value={propertyValue}
                          onChange={(e) => setPropertyValue(parseInt(e.target.value))}
                          className="w-full h-6 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, #1c3957 0%, #1c3957 ${((propertyValue - 3000) / (60000 - 3000)) * 100}%, #e2e8f0 ${((propertyValue - 3000) / (60000 - 3000)) * 100}%, #e2e8f0 100%)`,
                            outline: 'none',
                            height: '6px',
                            borderRadius: '3px'
                          }}
                        />
                      
                      <div className="flex justify-between text-sm text-slate-600 mt-4">
                        <span>3000€</span>
                        <span>60000€</span>
                      </div>
                    </div>
                  </div>

                  {/* Guarantee Section */}
                  <div className="bg-slate-100 rounded-lg p-8 text-center mb-16">
                    <h2 className="text-xl font-semibold text-slate-900 mb-4">
                      Votre garantie par objet
                    </h2>
                    <p className="text-sm text-slate-600 mb-8 max-w-4xl mx-auto">
                      Indiquez ici le montant maximal de garantie par élément transporté. Si cela ne suffit pas,
                      vous pourrez faire une{" "}
                      <span className="underline text-primary cursor-pointer">
                        déclaration de valeur
                      </span>
                      .
                    </p>

                    <div className="flex justify-center gap-4">
                      {[
                        { value: "250", label: "250 €" },
                        { value: "500", label: "500 €" },
                        { value: "1000", label: "1000 €" },
                      ].map((guarantee) => (
                        <Button
                          key={guarantee.value}
                          variant={selectedGuarantee === guarantee.value ? "default" : "outline"}
                          onClick={() => setSelectedGuarantee(guarantee.value)}
                          className={`px-8 py-3 ${
                            selectedGuarantee === guarantee.value
                              ? "bg-[#1c3957] hover:bg-[#1c3957]/90 text-white"
                              : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          {guarantee.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Options Section */}
                  <div id="options-section" className="mb-12">
                    <h2 className="text-xl font-semibold text-slate-900 text-center mb-8">
                      Choisissez vos options
                    </h2>

                    <div className="space-y-6">
                      {/* Option 1: Pack Cartons */}
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Package className="w-6 h-6" style={{ color: '#CC922F' }} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-slate-700 leading-relaxed">
                            Vous souhaitez qu'on vous fournisse un pack cartons, bulle et adhésif? Votre pack, expédié sous 48h, contiendra: 10 cartons standards, 5 cartons livres, 1 film bulles, 1 rouleau adhésif
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={options.packCartons}
                              onChange={(e) => setOptions(prev => ({ ...prev, packCartons: e.target.checked }))}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1c3957]"></div>
                          </label>
                        </div>
                      </div>

                      {/* Option 2: Date Flexible */}
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-6 h-6" style={{ color: '#CC922F' }} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-slate-700 leading-relaxed">
                            Vous serez peut être amené à modifier la date du déménagement? Reporter sans frais une fois la date du déménagement jusque 72h avant
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={options.dateFlexible}
                              onChange={(e) => setOptions(prev => ({ ...prev, dateFlexible: e.target.checked }))}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1c3957]"></div>
                          </label>
                        </div>
                      </div>

                      {/* Option 3: Prix Flexible */}
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <ArrowDown className="w-6 h-6" style={{ color: '#CC922F' }} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-slate-700 leading-relaxed">
                            Vous êtes flexible sur la date de la prestation? Economiser sur le prix de votre déménagement en étant flexible sur 14 jours
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={options.prixFlexible}
                              onChange={(e) => setOptions(prev => ({ ...prev, prixFlexible: e.target.checked }))}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1c3957]"></div>
                          </label>
                        </div>
                      </div>

                      {/* Option 4: Démontage Remontage */}
                      <div className="flex items-start gap-4">
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

                      {/* Option 5: Emballage Fragile */}
                      <div className="flex items-start gap-4">
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
                              onChange={(e) => setOptions(prev => ({ ...prev, emballageFragile: e.target.checked }))}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1c3957]"></div>
                          </label>
                        </div>
                      </div>

                      {/* Option 6: Emballage Cartons */}
                      <div className="flex items-start gap-4">
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
                              onChange={(e) => setOptions(prev => ({ ...prev, emballageCartons: e.target.checked }))}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1c3957]"></div>
                          </label>
                        </div>
                      </div>

                      {/* Option 7: Autorisation Stationnement */}
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Truck className="w-6 h-6" style={{ color: '#CC922F' }} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-slate-700 leading-relaxed">
                            L'autorisation de stationnement pour le camion est recommandé et parfois même obligatoire dans certaines communes. Vous souhaitez que nous fassions les démarches pour vous?
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={options.autorisationStationnement}
                              onChange={(e) => setOptions(prev => ({ ...prev, autorisationStationnement: e.target.checked }))}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1c3957]"></div>
                          </label>
                        </div>
                      </div>

                      {/* Option 8: Transport Vêtements */}
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Shirt className="w-6 h-6" style={{ color: '#CC922F' }} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-slate-700 leading-relaxed">
                            Il existe une solution pratique pour transporter vos vêtement sans les froisser. Vous souhaitez qu'on utilise des penderies pour transporter vos vêtements sur cintres?
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={options.transportVetements}
                              onChange={(e) => setOptions(prev => ({ ...prev, transportVetements: e.target.checked }))}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1c3957]"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Final Quote Section */}
                  <div className="text-center mb-8">
                    <p className="text-sm text-slate-600 mb-6">
                      Recevoir le devis avec les modifications et options supplémentaires que j'ai ajouté
                    </p>

                    <Button
                      onClick={handleSubmitOptions}
                      className="bg-[#1c3957] hover:bg-[#1c3957]/90 text-white px-12 py-3 rounded-lg"
                    >
                      RECEVOIR MON DEVIS
                    </Button>
                  </div>

                </div>

                {/* Floating Total Section */}
                <div className="fixed bottom-6 right-6 bg-white rounded-lg p-4 shadow-lg z-50 border border-slate-200">
                  <div className="flex items-center gap-4">
                    <div className="text-slate-900">
                      <div className="text-sm font-medium">TOTAL TTC</div>
                      <div className="text-lg font-bold">1582.51 €</div>
                    </div>
                    <Button 
                      className="bg-[#1c3957] text-white hover:bg-[#1c3957]/90 font-semibold px-4 py-2 rounded"
                    >
                      RESERVER
                    </Button>
                  </div>
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
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-3xl font-bold text-slate-900">
              Go
              <span className="bg-gradient-to-r from-[#CC922F] to-[#1c3957] text-white px-3 py-2 rounded ml-1">
                YARD
              </span>
            </h1>
            <p className="text-base text-slate-600 ml-3">
              Déménagement professionnel pour tous
            </p>
          </div>
          <div className="flex items-center bg-[#1c3957] text-white px-6 py-3 rounded-full">
            <Phone className="w-5 h-5 mr-2" style={{ color: '#CC922F' }} />
            <span className="text-base font-medium">
              09 74 50 50 47
            </span>
            <span className="text-sm ml-2 opacity-90">
              Numéro non surtaxé
            </span>
          </div>
        </div>
      </header>

       <div className="max-w-8xl mx-auto px-6 py-12">
         <div className="grid lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-slate-50 rounded-lg shadow-sm p-8">
              {currentPage === "form" && (
                <div>
                  {/* Sophie's Profile */}
                  <div className="flex items-start mb-10">
                    <div className="w-20 h-20 rounded-full overflow-hidden mr-5 flex-shrink-0">
                      <ImageWithFallback
                        src="/sophie.jpeg"
                        alt="Sophie"
                        className="w-full h-full object-cover"
                        style={{ transform: 'scale(1.2)' }}
                      />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900 mb-2">
                        Sophie
                      </h2>
                      <p className="text-primary text-base mb-3">
                        Bonjour ! Je suis Sophie.
                      </p>
                      <p className="text-slate-600 text-base leading-relaxed">
                        En quelques questions, je vais vous trouver le service
                        <br />
                        de déménagement qui vous convient au meilleur prix.
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
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: '#CC922F' }} />
                        <Input
                          id="address"
                          type="text"
                          placeholder="Quelle est votre adresse ?"
                          value={formData.address}
                          onChange={(e) =>
                            handleInputChange("address", e.target.value)
                          }
                          className="pl-12 bg-slate-50 border-slate-200 h-12 text-base"
                        />
                      </div>
                    </div>

                    <div>
                      <Label
                        htmlFor="date"
                        className="text-slate-900 mb-2 block"
                      >
                        Date de déménagement préférée
                      </Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: '#CC922F' }} />
                        <Input
                          id="date"
                          type="date"
                          value={formData.date}
                          onChange={(e) =>
                            handleInputChange("date", e.target.value)
                          }
                          className="pl-10 bg-slate-50 border-slate-200 cursor-pointer"
                          style={{ colorScheme: 'light' }}
                        />
                        {/* Custom date picker button */}
                        <button
                          type="button"
                          onClick={() => (document.getElementById('date') as HTMLInputElement)?.showPicker()}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-[#CC922F]/10 rounded transition-colors"
                          title="Sélectionner une date"
                        >
                          <Calendar className="w-4 h-4" style={{ color: '#CC922F' }} />
                        </button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label
                          htmlFor="name"
                          className="text-slate-900 mb-2 block"
                        >
                          Nom
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: '#CC922F' }} />
                          <Input
                            id="name"
                            type="text"
                            placeholder="Nom de famille"
                            value={formData.name}
                            onChange={(e) =>
                              handleInputChange("name", e.target.value)
                            }
                            className="pl-10 bg-slate-50 border-slate-200"
                          />
                        </div>
                      </div>
                      <div>
                        <Label
                          htmlFor="firstName"
                          className="text-slate-900 mb-2 block"
                        >
                          Prénom
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: '#CC922F' }} />
                          <Input
                            id="firstName"
                            type="text"
                            placeholder="Prénom"
                            value={formData.firstName}
                            onChange={(e) =>
                              handleInputChange("firstName", e.target.value)
                            }
                            className="pl-10 bg-slate-50 border-slate-200"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label
                        htmlFor="email"
                        className="text-slate-900 mb-2 block"
                      >
                        Email
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: '#CC922F' }} />
                        <Input
                          id="email"
                          type="email"
                          placeholder="Adresse email"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          className="pl-10 bg-slate-50 border-slate-200"
                        />
                      </div>
                    </div>

                    <div>
                      <Label
                        htmlFor="phone"
                        className="text-slate-900 mb-2 block"
                      >
                        Téléphone
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: '#CC922F' }} />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="Numéro de téléphone"
                          value={formData.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          className="pl-10 bg-slate-50 border-slate-200"
                        />
                      </div>
                    </div>

                    <p className="text-xs text-primary leading-relaxed">
                      En soumettant ce formulaire, j'accepte d'être contacté par GoYard et ses
                      partenaires pour l'organisation de mon service de déménagement.
                    </p>

                    <Button
                      className="w-full bg-[#1c3957] hover:bg-[#1c3957]/90 text-white py-3 rounded-lg font-medium"
                      size="lg"
                      onClick={handleSubmitForm}
                    >
                      VOIR LES PRIX →
                    </Button>
                  </div>
                </div>
              )}

              {currentPage === "methods" && (
                <>
                  {/* Sophie's Profile - Methods Page */}
                  <div className="flex items-start mb-8">
                    <div className="w-20 h-20 rounded-full overflow-hidden mr-5 flex-shrink-0">
                      <ImageWithFallback
                        src="/sophie.jpeg"
                        alt="Sophie"
                        className="w-full h-full object-cover"
                        style={{ transform: 'scale(1.2)' }}
                      />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900 mb-1">
                        Sophie
                      </h2>
                      <p className="text-primary text-sm mb-2">
                        Parfait ! On est à quelques clics de votre devis.
                      </p>
                    </div>
                  </div>

                  {/* Method Selection */}
                  <div className="space-y-4">
                    {/* Method 1: List Cleaning Tasks */}
                    <div
                      className="border-2 border-slate-200 rounded-lg p-6 hover:border-[#1c3957] cursor-pointer transition-colors"
                      onClick={() => handleSelectMethod("list")}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                           <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mr-4">
                             <List className="w-6 h-6" style={{ color: '#CC922F' }} />
                           </div>
                          <div>
                            <h3 className="font-semibold text-slate-900 mb-1">
                              Je liste mes objets à déménager
                            </h3>
                            <p className="text-sm text-slate-600">
                              Préciser quelles pièces et objets vous souhaitez déménager.
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 style={{ color: '#CC922F' }}" />
                      </div>
                    </div>

                    {/* Method 2: AI Photo Detection */}
                    <div
                      className="border-2 border-slate-200 rounded-lg p-6 hover:border-[#1c3957] cursor-pointer transition-colors"
                      onClick={() => handleSelectMethod("photo")}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                           <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mr-4 relative">
                             <Camera className="w-6 h-6" style={{ color: '#CC922F' }} />
                             <div className="absolute -top-1 -right-1 bg-[#1c3957] text-white text-xs px-1 py-0.5 rounded">
                               IA
                             </div>
                           </div>
                          <div>
                            <h3 className="font-semibold text-slate-900 mb-1">
                              J'envoie des photos de mon espace
                            </h3>
                            <p className="text-sm text-slate-600">
                              Notre IA évaluera automatiquement le volume de votre déménagement.
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 style={{ color: '#CC922F' }}" />
                      </div>
                    </div>

                    {/* Method 3: Surface Area Based Quote */}
                    <div
                      className="border-2 border-slate-200 rounded-lg p-6 hover:border-[#1c3957] cursor-pointer transition-colors"
                      onClick={() => handleSelectMethod("surface")}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                           <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mr-4">
                             <Maximize2 className="w-6 h-6" style={{ color: '#CC922F' }} />
                           </div>
                          <div>
                            <h3 className="font-semibold text-slate-900 mb-1">
                              Mon devis en fonction de la superficie
                            </h3>
                            <p className="text-sm text-slate-600">
                              Obtenez une estimation rapide basée sur la surface totale de votre logement.
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 style={{ color: '#CC922F' }}" />
                      </div>
                    </div>

                     {/* Back Button */}
                     <div className="mt-8">
                       <Button
                         variant="outline"
                         onClick={handleBackToForm}
                         className="flex items-center gap-2 bg-[#1c3957] hover:bg-[#1c3957]/90 text-white hover:text-white border-[#1c3957]"
                       >
                         <ArrowLeft className="w-4 h-4" />
                         RETOUR
                       </Button>
                     </div>
                  </div>
                </>
              )}

              {currentPage === "volume" && selectedMethod === "list" && (
                <>
                  {/* Sophie's Profile - Cleaning Page */}
                  <div className="flex items-start mb-6">
                    <div className="w-20 h-20 rounded-full overflow-hidden mr-5 flex-shrink-0">
                      <ImageWithFallback
                        src="/sophie.jpeg"
                        alt="Sophie"
                        className="w-full h-full object-cover"
                        style={{ transform: 'scale(1.2)' }}
                      />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900 mb-1">
                        Sophie
                      </h2>
                      <p className="text-primary text-sm">
                        Parfait ! Précisez pièce par pièce les objets à déménager dont vous avez besoin.
                      </p>
                    </div>
                  </div>

                  {/* Room Navigation */}
                  <div className="flex items-center justify-center mb-6">
                    <div className="flex items-center bg-slate-100 rounded-full px-6 py-3 gap-6">
                      {/* Left Arrow Button */}
                      <button
                        onClick={handlePreviousRoomPage}
                        disabled={currentRoomIndex === 0}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                      </button>
                      
                      {/* Room Buttons */}
                      <div className="flex gap-2">
                        {getVisibleRooms().map((room) => (
                          <button
                        key={room}
                        onClick={() => setSelectedRoom(room)}
                            className={`px-4 py-2 rounded-full text-base font-medium transition-colors ${
                              selectedRoom === room
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
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 style={{ color: '#CC922F' }} w-4 h-4" />
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
                          className={`rounded-lg p-4 text-center relative transition-colors ${
                            hasQuantity 
                              ? 'bg-slate-50 border-2 shadow-md' 
                              : 'bg-slate-50'
                          }`}
                          style={hasQuantity ? { borderColor: '#1c3957' } : {}}
                        >
                        {/* Delete icon for custom objects */}
                        {isCustomObject(item.name) && (
                          <Trash2 
                            className="absolute top-2 right-2 w-4 h-4 cursor-pointer hover:scale-110 transition-transform"
                            style={{ color: '#CC922F' }}
                            onClick={() => deleteCustomObject(item.name)}
                            title="Supprimer cet objet personnalisé"
                          />
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
                            <Minus className="w-4 h-4 style={{ color: '#CC922F' }}" />
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
                            <Plus className="w-4 h-4 style={{ color: '#CC922F' }}" />
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
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ml-2 ${
                              hasSpecialObjects ? 'bg-[#1c3957]' : 'bg-slate-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                hasSpecialObjects ? 'translate-x-6' : 'translate-x-1'
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
                                  className={`rounded-lg p-4 text-center transition-colors relative ${
                                    hasQuantity 
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
                                    <BoxIcon />
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
                  <div className="flex items-start mb-8">
                    <div className="w-20 h-20 rounded-full overflow-hidden mr-5 flex-shrink-0">
                      <ImageWithFallback
                        src="/sophie.jpeg"
                        alt="Sophie"
                        className="w-full h-full object-cover"
                        style={{ transform: 'scale(1.2)' }}
                      />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900 mb-1">
                        Sophie
                      </h2>
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
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ml-2 ${
                                hasSpecialObjects ? 'bg-[#1c3957]' : 'bg-slate-300'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  hasSpecialObjects ? 'translate-x-6' : 'translate-x-1'
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
                                    className={`rounded-lg p-4 text-center transition-colors relative ${
                                      hasQuantity
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
                                      <BoxIcon />
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
                        disabled={!surfaceArea || parseInt(surfaceArea) <= 0}
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
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold mb-2">Sélectionnez le type de pièce</h2>
                    <p className="text-muted-foreground">
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
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
                                className={`p-3 rounded-lg ${
                                  isSelected 
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
                            <div className={`p-3 rounded-lg ${
                              isSelected
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
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ml-2 ${
                                hasSpecialObjects ? 'bg-[#1c3957]' : 'bg-slate-300'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  hasSpecialObjects ? 'translate-x-6' : 'translate-x-1'
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
                                    className={`rounded-lg p-4 text-center transition-colors relative ${
                                      hasQuantity 
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
                                      <BoxIcon />
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
                                  const quantity = typeof objectData === 'number' ? objectData : objectData?.quantity || 0;
                                  const isUserAdded = typeof objectData === 'object' && objectData?.is_ai_detected === false;
                                  
                                  return (
                                    <div 
                                      key={object} 
                                      className={`bg-slate-50 rounded-lg p-4 relative ${
                                        isUserAdded ? 'border-2 border-[#CC922F]' : 'border border-slate-200'
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
                                      const roomMapping = {
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
                                      const commonObjects = {
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
                                        const quantity = isDetectedObject ? (typeof objectData === 'number' ? objectData : objectData?.quantity || 0) : 0;
                                        const isUserAdded = isDetectedObject && typeof objectData === 'object' && objectData?.is_ai_detected === false;
                                        
                                        return (
                                          <div
                                            key={objectName}
                                            className={`p-3 cursor-pointer hover:bg-slate-50 border-b border-slate-100 last:border-b-0 ${
                                              isUserAdded ? 'bg-[#CC922F]/10 border-l-4 border-l-[#CC922F]' : ''
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
                  <div className="flex items-start mb-6">
                    <div className="w-20 h-20 rounded-full overflow-hidden mr-5 flex-shrink-0">
                      <ImageWithFallback
                        src="/sophie.jpeg"
                        alt="Sophie"
                        className="w-full h-full object-cover"
                        style={{ transform: 'scale(1.2)' }}
                      />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900 mb-1">
                        Sophie
                      </h2>
                      <p className="text-primary text-sm">
                        Pouvez-vous m'en dire un peu plus sur les adresses ? Départ, arrivée et éventuelles étapes intermédiaires.
                      </p>
                    </div>
                  </div>

                  {/* Departure Section */}
                  <div className="mb-8 border-2 border-slate-200 rounded-lg p-6 bg-white">
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
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#CC922F' }} />
                          <Input
                            type="text"
                            value={addressData.departure.address}
                            onChange={(e) =>
                              updateAddressData("departure", "address", e.target.value)
                            }
                            className="bg-slate-50 border-slate-200 pl-12"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-slate-900 mb-2 block">Étage</Label>
                          <Select
                            value={addressData.departure.floor}
                            onValueChange={(value) =>
                              updateAddressData("departure", "floor", value)
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
                            value={addressData.departure.elevator}
                            onValueChange={(value) =>
                              updateAddressData("departure", "elevator", value)
                            }
                          >
                            <SelectTrigger className="bg-slate-50 border-slate-200">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-slate-200 shadow-lg">
                              <SelectItem value="Non">Non</SelectItem>
                              <SelectItem value="1 personne">1 personne</SelectItem>
                              <SelectItem value="2 personnes">2 personnes</SelectItem>
                              <SelectItem value="3 personnes">3 personnes</SelectItem>
                              <SelectItem value="4 personnes et plus">4 personnes et plus</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="departure-monte-meuble"
                            checked={addressData.departure.options.monteMenuble}
                            onCheckedChange={(checked) =>
                              updateAddressOption("departure", "monteMenuble", checked as boolean)
                            }
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
                      </div>
                    </div>
                  </div>

                  {/* Escales Sections */}
                  {escales.map((escale, index) => (
                    <div key={escale.id} className="mb-8 border-2 border-slate-200 rounded-lg p-6 bg-white">
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
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#CC922F' }} />
                            <Input
                              type="text"
                              placeholder="Quelle adresse pour l'escale ?"
                              value={escale.address}
                              onChange={(e) =>
                                updateEscaleData(escale.id, "address", e.target.value)
                              }
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
                              onValueChange={(value) =>
                                updateEscaleData(escale.id, "elevator", value)
                              }
                            >
                              <SelectTrigger className="bg-slate-50 border-slate-200">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-white border border-slate-200 shadow-lg">
                                <SelectItem value="Non">Non</SelectItem>
                                <SelectItem value="1 personne">1 personne</SelectItem>
                                <SelectItem value="2 personnes">2 personnes</SelectItem>
                                <SelectItem value="3 personnes">3 personnes</SelectItem>
                                <SelectItem value="4 personnes et plus">4 personnes et plus</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center space-x-2">
                            <Switch
                              id={`escale-${escale.id}-monte-meuble`}
                              checked={escale.options.monteMenuble}
                              onCheckedChange={(checked) =>
                                updateEscaleOption(escale.id, "monteMenuble", checked as boolean)
                              }
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
                  <div className="mb-8 border-2 border-slate-200 rounded-lg p-6 bg-white">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
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
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#CC922F' }} />
                          <Input
                            type="text"
                            placeholder="Quel point d'arrivée ?"
                            value={addressData.arrival.address}
                            onChange={(e) =>
                              updateAddressData("arrival", "address", e.target.value)
                            }
                            className="bg-slate-50 border-slate-200 pl-12"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-slate-900 mb-2 block">Étage</Label>
                          <Select
                            value={addressData.arrival.floor}
                            onValueChange={(value) =>
                              updateAddressData("arrival", "floor", value)
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
                            value={addressData.arrival.elevator}
                            onValueChange={(value) =>
                              updateAddressData("arrival", "elevator", value)
                            }
                          >
                            <SelectTrigger className="bg-slate-50 border-slate-200">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-slate-200 shadow-lg">
                              <SelectItem value="Non">Non</SelectItem>
                              <SelectItem value="1 personne">1 personne</SelectItem>
                              <SelectItem value="2 personnes">2 personnes</SelectItem>
                              <SelectItem value="3 personnes">3 personnes</SelectItem>
                              <SelectItem value="4 personnes et plus">4 personnes et plus</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="arrival-monte-meuble"
                            checked={addressData.arrival.options.monteMenuble}
                            onCheckedChange={(checked) =>
                              updateAddressOption("arrival", "monteMenuble", checked as boolean)
                            }
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
                      <ArrowLeft className="w-4 h-4 style={{ color: '#CC922F' }}" />
                      RETOUR
                    </Button>
                    <Button
                      className="bg-[#1c3957] hover:bg-[#1c3957]/90 text-white flex-1"
                      onClick={handleContinueToQuote}
                    >
                      MON DEVIS →
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>

           {/* Sidebar */}
           <div className="space-y-12">
             {/* Mes étapes */}
             <div className="bg-white rounded-lg shadow-sm p-8">
               <h3 className="text-xl font-semibold text-slate-900 mb-4">
                 Mes étapes
               </h3>
               <p className="text-base text-slate-600 mb-6">
                 Sélectionnez l'étape sur laquelle vous souhaitez revenir
               </p>
               <ul className="space-y-4">
                 <li className="flex items-center">
                   <div className={`w-3 h-3 rounded-full mr-4 ${
                     currentPage === "form" ? "bg-slate-900" : "bg-slate-300"
                   }`}></div>
                   <span className={`text-base ${
                     currentPage === "form" ? "font-medium text-slate-900" : "text-slate-500"
                   }`}>Mes informations</span>
                 </li>
                 <li className="flex items-center">
                   <div className={`w-3 h-3 rounded-full mr-4 ${
                     currentPage === "methods" ? "bg-slate-900" : "bg-slate-300"
                   }`}></div>
                   <span className={`text-base ${
                     currentPage === "methods" ? "font-medium text-slate-900" : "text-slate-500"
                   }`}>Mon déménagement</span>
                 </li>
                 {(currentPage === "volume" || currentPage === "ai-results" || currentPage === "addresses") && selectedMethod && (
                   <li className="flex items-center">
                     <div className={`w-3 h-3 rounded-full mr-4 ${
                       currentPage === "volume" || currentPage === "ai-results" ? "bg-slate-900" : "bg-slate-300"
                     }`}></div>
                     <span className={`text-base ${
                       currentPage === "volume" || currentPage === "ai-results" ? "font-medium text-slate-900" : "text-slate-500"
                     }`}>
                       {selectedMethod === "list" ? "Inventaire manuel" : 
                        selectedMethod === "photo" ? "Analyse IA" : 
                        selectedMethod === "surface" ? "Calcul surface" : "Méthode sélectionnée"}
                     </span>
                   </li>
                 )}
                 <li className="flex items-center">
                   <div className={`w-3 h-3 rounded-full mr-4 ${
                     currentPage === "addresses" ? "bg-slate-900" : "bg-slate-300"
                   }`}></div>
                   <span className={`text-base ${
                     currentPage === "addresses" ? "font-medium text-slate-900" : "text-slate-500"
                   }`}>Mes adresses</span>
                 </li>
               </ul>
             </div>

             {/* Trust Indicators */}
             <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
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
            GoYard est une société française de services de déménagement professionnel fondée en 2018. Nous sommes
            entièrement agréés, assurés et cautionnés. Notre équipe de déménageurs professionnels certifiés
            subit des vérifications d'antécédents approfondies et une formation approfondie pour garantir un
            service de la plus haute qualité. GoYard s'engage à utiliser des techniques de déménagement modernes et
            à maintenir les normes les plus élevées de sécurité et de satisfaction client.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/solution" element={<Solution />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogArticle />} />
        <Route path="/faq" element={<FAQ />} />
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
      </Routes>
    </Router>
  );
}

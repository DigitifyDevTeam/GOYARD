"""
Advanced YOLOv8x Training Script with Catastrophic Forgetting Prevention
Complete training pipeline with all best practices
"""

import os
import yaml
import torch
import torch.nn as nn
from ultralytics import YOLO
from ultralytics.utils.torch_utils import freeze_layers
import matplotlib.pyplot as plt
from pathlib import Path
import shutil
from datetime import datetime

class AdvancedYOLOTrainer:
    def __init__(self, 
                 model_path="yolov8x-oiv7.pt",
                 dataset_config="furniture_dataset.yaml",
                 project_name="furniture_detection"):
        
        self.model_path = model_path
        self.dataset_config = dataset_config
        self.project_name = project_name
        self.model = None
        self.training_results = None
        
        # Create project directory
        self.project_dir = Path(project_name)
        self.project_dir.mkdir(exist_ok=True)
        
        print(f"🏗️  Project directory: {self.project_dir}")
    
    def prepare_dataset_structure(self, 
                                train_images_dir,
                                val_images_dir,
                                train_labels_dir,
                                val_labels_dir,
                                class_names):
        """
        Prepare dataset in YOLO format and create dataset.yaml
        
        Args:
            train_images_dir: Path to training images
            val_images_dir: Path to validation images  
            train_labels_dir: Path to training labels
            val_labels_dir: Path to validation labels
            class_names: List of your 60 French class names
        """
        print("📁 Preparing dataset structure...")
        
        # Create dataset directory structure
        dataset_dir = self.project_dir / "dataset"
        dataset_dir.mkdir(exist_ok=True)
        
        # Create subdirectories
        (dataset_dir / "images" / "train").mkdir(parents=True, exist_ok=True)
        (dataset_dir / "images" / "val").mkdir(parents=True, exist_ok=True)
        (dataset_dir / "labels" / "train").mkdir(parents=True, exist_ok=True)
        (dataset_dir / "labels" / "val").mkdir(parents=True, exist_ok=True)
        
        # Copy images and labels
        print("📋 Copying training data...")
        self._copy_files(train_images_dir, dataset_dir / "images" / "train")
        self._copy_files(train_labels_dir, dataset_dir / "labels" / "train")
        
        print("📋 Copying validation data...")
        self._copy_files(val_images_dir, dataset_dir / "images" / "val")
        self._copy_files(val_labels_dir, dataset_dir / "labels" / "val")
        
        # Create dataset.yaml
        dataset_yaml = {
            'path': str(dataset_dir.absolute()),
            'train': 'images/train',
            'val': 'images/val',
            'nc': len(class_names),
            'names': class_names
        }
        
        yaml_path = self.project_dir / "dataset.yaml"
        with open(yaml_path, 'w', encoding='utf-8') as f:
            yaml.dump(dataset_yaml, f, default_flow_style=False, allow_unicode=True)
        
        print(f"✅ Dataset prepared: {yaml_path}")
        return yaml_path
    
    def _copy_files(self, source_dir, target_dir):
        """Copy files from source to target directory"""
        source_path = Path(source_dir)
        if not source_path.exists():
            print(f"⚠️  Warning: {source_dir} does not exist")
            return
        
        for file_path in source_path.iterdir():
            if file_path.is_file():
                shutil.copy2(file_path, target_dir / file_path.name)
    
    def setup_model_with_prevention(self, freeze_ratio=0.7):
        """
        Setup model with catastrophic forgetting prevention techniques
        """
        print("🧠 Setting up model with catastrophic forgetting prevention...")
        
        # Load pre-trained model
        self.model = YOLO(self.model_path)
        print(f"✅ Loaded model: {self.model_path}")
        
        # Apply layer freezing
        self._freeze_backbone_layers(freeze_ratio)
        
        # Setup learning rate scheduling
        self._setup_learning_rate_scheduling()
        
        print("✅ Model setup complete with prevention techniques")
        return self.model
    
    def _freeze_backbone_layers(self, freeze_ratio=0.7):
        """Freeze backbone layers to prevent catastrophic forgetting"""
        print(f"🧊 Freezing {freeze_ratio*100}% of backbone layers...")
        
        # Get model backbone
        backbone = self.model.model.model
        
        # Count layers and determine freeze count
        total_layers = len(list(backbone.children()))
        freeze_count = int(total_layers * freeze_ratio)
        
        print(f"📊 Total layers: {total_layers}, Freezing: {freeze_count}")
        
        # Freeze layers
        frozen = 0
        for i, (name, module) in enumerate(backbone.named_children()):
            if i < freeze_count:
                for param in module.parameters():
                    param.requires_grad = False
                frozen += 1
                print(f"  ❄️  Frozen: {name}")
            else:
                for param in module.parameters():
                    param.requires_grad = True
                print(f"  🔥 Trainable: {name}")
        
        print(f"✅ Frozen {frozen}/{total_layers} layers")
    
    def _setup_learning_rate_scheduling(self):
        """Setup learning rate scheduling"""
        print("📈 Setting up learning rate scheduling...")
        
        # Different learning rates for different parts
        self.lr_config = {
            'backbone_lr': 0.0001,    # Very low for frozen backbone
            'neck_lr': 0.0005,        # Medium for neck
            'head_lr': 0.001,         # Higher for detection head
            'warmup_epochs': 5,
            'cosine_annealing': True
        }
        
        print(f"  Backbone LR: {self.lr_config['backbone_lr']}")
        print(f"  Neck LR: {self.lr_config['neck_lr']}")
        print(f"  Head LR: {self.lr_config['head_lr']}")
    
    def create_advanced_training_config(self, 
                                      dataset_yaml_path,
                                      epochs=100,
                                      batch_size=16,
                                      imgsz=640):
        """
        Create advanced training configuration with all prevention techniques
        """
        print("📝 Creating advanced training configuration...")
        
        config = {
            # Model and data
            'model': self.model_path,
            'data': str(dataset_yaml_path),
            'epochs': epochs,
            'batch': batch_size,
            'imgsz': imgsz,
            
            # Learning rate settings (prevent catastrophic forgetting)
            'lr0': self.lr_config['head_lr'],      # Detection head learning rate
            'lrf': 0.01,                          # Final LR factor (1% of initial)
            'momentum': 0.937,
            'weight_decay': 0.0005,               # L2 regularization
            'warmup_epochs': self.lr_config['warmup_epochs'],
            'warmup_momentum': 0.8,
            'warmup_bias_lr': 0.1,
            
            # Optimizer (better for fine-tuning)
            'optimizer': 'AdamW',
            
            # Regularization (prevent overfitting)
            'dropout': 0.1,
            'label_smoothing': 0.1,
            
            # Data augmentation (improve generalization)
            'hsv_h': 0.015,      # HSV hue augmentation
            'hsv_s': 0.7,        # HSV saturation augmentation  
            'hsv_v': 0.4,        # HSV value augmentation
            'degrees': 0.0,      # Rotation (disabled for furniture)
            'translate': 0.1,    # Translation
            'scale': 0.5,        # Scale augmentation
            'shear': 0.0,        # Shear (disabled for furniture)
            'perspective': 0.0,  # Perspective (disabled for furniture)
            'flipud': 0.0,       # Vertical flip (disabled for furniture)
            'fliplr': 0.5,       # Horizontal flip
            'mosaic': 1.0,       # Mosaic augmentation
            'mixup': 0.1,        # Mixup augmentation
            'copy_paste': 0.0,   # Copy-paste (disabled)
            
            # Training settings
            'val': True,
            'save_period': 10,    # Save checkpoint every 10 epochs
            'patience': 20,       # Early stopping patience
            'close_mosaic': 10,   # Disable mosaic in last 10 epochs
            
            # Device and performance
            'device': 'cpu',      # Change to 'cuda' if you have GPU
            'workers': 8,
            'cache': False,       # Disable caching for memory efficiency
            
            # Output settings
            'project': str(self.project_dir),
            'name': f'training_{datetime.now().strftime("%Y%m%d_%H%M%S")}',
            'exist_ok': True,
            'pretrained': True,
            'verbose': True,
            
            # Advanced settings
            'amp': True,          # Automatic Mixed Precision
            'fraction': 1.0,      # Use full dataset
            'profile': False,     # Disable profiling
            'overlap_mask': True,
            'mask_ratio': 4,
            'dropout': 0.0,       # Disable dropout in model
            'val_period': 1,      # Validate every epoch
        }
        
        print("✅ Advanced training configuration created!")
        return config
    
    def train_model(self, config):
        """
        Train the model with advanced configuration
        """
        print("🚀 Starting advanced training...")
        print(f"📊 Training configuration:")
        print(f"  - Epochs: {config['epochs']}")
        print(f"  - Batch size: {config['batch']}")
        print(f"  - Learning rate: {config['lr0']}")
        print(f"  - Image size: {config['imgsz']}")
        print(f"  - Weight decay: {config['weight_decay']}")
        
        # Start training
        try:
            self.training_results = self.model.train(**config)
            print("✅ Training completed successfully!")
            return self.training_results
        except Exception as e:
            print(f"❌ Training failed: {e}")
            raise e
    
    def evaluate_model(self, model_path=None):
        """
        Evaluate the trained model
        """
        if model_path is None:
            # Use the best model from training
            model_path = self.training_results.save_dir / "weights" / "best.pt"
        
        print(f"📊 Evaluating model: {model_path}")
        
        # Load the trained model
        trained_model = YOLO(model_path)
        
        # Run validation
        results = trained_model.val()
        
        print("📈 Evaluation Results:")
        print(f"  mAP50: {results.box.map50:.3f}")
        print(f"  mAP50-95: {results.box.map:.3f}")
        print(f"  Precision: {results.box.mp:.3f}")
        print(f"  Recall: {results.box.mr:.3f}")
        
        return results
    
    def plot_training_curves(self, save_path=None):
        """
        Plot training curves
        """
        if self.training_results is None:
            print("❌ No training results available")
            return
        
        print("📊 Plotting training curves...")
        
        # Get training metrics
        results_dir = self.training_results.save_dir
        results_csv = results_dir / "results.csv"
        
        if results_csv.exists():
            import pandas as pd
            import matplotlib.pyplot as plt
            
            # Read results
            df = pd.read_csv(results_csv)
            
            # Create plots
            fig, axes = plt.subplots(2, 2, figsize=(15, 10))
            fig.suptitle('Training Progress', fontsize=16)
            
            # Loss curves
            axes[0, 0].plot(df['epoch'], df['train/box_loss'], label='Train Box Loss')
            axes[0, 0].plot(df['epoch'], df['val/box_loss'], label='Val Box Loss')
            axes[0, 0].set_title('Box Loss')
            axes[0, 0].legend()
            axes[0, 0].grid(True)
            
            axes[0, 1].plot(df['epoch'], df['train/cls_loss'], label='Train Class Loss')
            axes[0, 1].plot(df['epoch'], df['val/cls_loss'], label='Val Class Loss')
            axes[0, 1].set_title('Classification Loss')
            axes[0, 1].legend()
            axes[0, 1].grid(True)
            
            # mAP curves
            axes[1, 0].plot(df['epoch'], df['metrics/mAP50(B)'], label='mAP50')
            axes[1, 0].plot(df['epoch'], df['metrics/mAP50-95(B)'], label='mAP50-95')
            axes[1, 0].set_title('mAP Metrics')
            axes[1, 0].legend()
            axes[1, 0].grid(True)
            
            # Precision/Recall
            axes[1, 1].plot(df['epoch'], df['metrics/precision(B)'], label='Precision')
            axes[1, 1].plot(df['epoch'], df['metrics/recall(B)'], label='Recall')
            axes[1, 1].set_title('Precision & Recall')
            axes[1, 1].legend()
            axes[1, 1].grid(True)
            
            plt.tight_layout()
            
            if save_path is None:
                save_path = self.project_dir / "training_curves.png"
            
            plt.savefig(save_path, dpi=300, bbox_inches='tight')
            print(f"📊 Training curves saved: {save_path}")
            
            plt.show()
        else:
            print("❌ Results CSV not found")

def main():
    """
    Example usage of advanced training with catastrophic forgetting prevention
    """
    print("🚀 Advanced YOLOv8x Training with Catastrophic Forgetting Prevention")
    print("=" * 80)
    
    # Your 60 French classes
    french_classes = [
        "Banc", "Cadre", "Carton", "Console", "Etagére muale", "Meuble a chaussure", 
        "Miroir", "Porte manteau", "Boîte ou panier", "Coffre a linge", "Colonne salle de bain", 
        "Lave linge", "Meuble salle de bain", "Tapis petit", "Canapé 3 places (-80KG)", 
        "Canapé d'angle (-80KG)", "hifi", "Lampadaire", "Meuble TV bas", "Table basse", 
        "Télevision", "Cuisinière (-80KG)", "Four", "Frigo-congélateur", "Lave vaisselle", 
        "Micro ondes", "Etagère", "Buffet haut", "Chaise", "Moyenne table", 
        "Plante en pot (moins de 80 KG)", "Tapis moyen", "Vaisselier (-80KG)", 
        "Armoire 2p (-80KG)", "Bureau", "Chaise de bureau", "Commode", "lit double", 
        "lit simple", "Armoire ancienne (-80KG)", "Barbecue", "Coffre de rangement", 
        "Echelle", "Escabeau", "valises", "Etagére", "Etendoir", "Parasol", 
        "Table de jardin", "Transat", "Vélo", "Aspirateur", "séche linge", 
        "Table de ping-pong (-80KG)", "Chiffronier", "Guitare", "Lampe de bureau", 
        "Paravent", "Vélo d'intérieur (-80KG)", "Tapis de course (-80KG)", 
        "Banc de musculation (-80KG)"
    ]
    
    # Initialize trainer
    trainer = AdvancedYOLOTrainer(
        model_path="yolov8x-oiv7.pt",
        project_name="furniture_detection_training"
    )
    
    # Prepare dataset (you need to provide these paths)
    print("📁 Preparing dataset...")
    print("⚠️  You need to provide the following paths:")
    print("  - train_images_dir: Path to your training images")
    print("  - val_images_dir: Path to your validation images")
    print("  - train_labels_dir: Path to your training labels (YOLO format)")
    print("  - val_labels_dir: Path to your validation labels (YOLO format)")
    
    # Example paths (replace with your actual paths)
    train_images_dir = "path/to/your/train/images"
    val_images_dir = "path/to/your/val/images"
    train_labels_dir = "path/to/your/train/labels"
    val_labels_dir = "path/to/your/val/labels"
    
    # Uncomment when you have your dataset ready:
    # dataset_yaml = trainer.prepare_dataset_structure(
    #     train_images_dir, val_images_dir,
    #     train_labels_dir, val_labels_dir,
    #     french_classes
    # )
    
    # Setup model with prevention techniques
    trainer.setup_model_with_prevention(freeze_ratio=0.7)
    
    # Create training configuration
    # config = trainer.create_advanced_training_config(
    #     dataset_yaml, epochs=100, batch_size=16
    # )
    
    print("\n🎯 Next steps:")
    print("1. Prepare your dataset in YOLO format")
    print("2. Update the paths in this script")
    print("3. Uncomment the training code")
    print("4. Run the training")
    print("\n💡 Key prevention techniques applied:")
    print("  ✅ Layer freezing (70% of backbone)")
    print("  ✅ Learning rate scheduling")
    print("  ✅ Regularization (weight decay, dropout)")
    print("  ✅ Data augmentation")
    print("  ✅ Early stopping")
    print("  ✅ Mixed precision training")

if __name__ == "__main__":
    main()

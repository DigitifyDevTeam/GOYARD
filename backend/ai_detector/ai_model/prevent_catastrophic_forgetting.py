"""
Prevent Catastrophic Forgetting in YOLOv8x Fine-tuning
Techniques to preserve pre-trained knowledge while learning new classes
"""

import torch
import torch.nn as nn
from ultralytics import YOLO
from ultralytics.utils.torch_utils import freeze_layers
import yaml
import os
from pathlib import Path

class CatastrophicForgettingPrevention:
    def __init__(self, model_path="yolov8x-oiv7.pt"):
        self.model_path = model_path
        self.model = None
        
    def load_pretrained_model(self):
        """Load the pre-trained YOLOv8x model"""
        print("🔄 Loading pre-trained YOLOv8x model...")
        self.model = YOLO(self.model_path)
        print(f"✅ Model loaded: {self.model_path}")
        return self.model
    
    def freeze_backbone_layers(self, freeze_ratio=0.7):
        """
        Freeze backbone layers to prevent catastrophic forgetting
        
        Args:
            freeze_ratio (float): Percentage of backbone layers to freeze (0.0-1.0)
                                0.7 = freeze 70% of backbone layers
        """
        if self.model is None:
            raise ValueError("Model not loaded. Call load_pretrained_model() first.")
        
        print(f"🧊 Freezing {freeze_ratio*100}% of backbone layers...")
        
        # Get the model's backbone (feature extractor)
        backbone = self.model.model.model  # YOLOv8 model structure
        
        # Count total backbone layers
        total_layers = len(list(backbone.children()))
        freeze_count = int(total_layers * freeze_ratio)
        
        print(f"📊 Total backbone layers: {total_layers}")
        print(f"🧊 Freezing first {freeze_count} layers")
        
        # Freeze the first N layers (feature extractor)
        frozen_layers = 0
        for i, (name, module) in enumerate(backbone.named_children()):
            if i < freeze_count:
                # Freeze this layer
                for param in module.parameters():
                    param.requires_grad = False
                frozen_layers += 1
                print(f"  ❄️  Frozen: {name}")
            else:
                # Keep this layer trainable
                for param in module.parameters():
                    param.requires_grad = True
                print(f"  🔥 Trainable: {name}")
        
        print(f"✅ Frozen {frozen_layers} layers, {total_layers - frozen_layers} trainable")
        return frozen_layers
    
    def freeze_specific_layers(self, layer_names_to_freeze):
        """
        Freeze specific layers by name
        
        Args:
            layer_names_to_freeze (list): List of layer names to freeze
        """
        if self.model is None:
            raise ValueError("Model not loaded. Call load_pretrained_model() first.")
        
        print(f"🧊 Freezing specific layers: {layer_names_to_freeze}")
        
        backbone = self.model.model.model
        frozen_count = 0
        
        for name, module in backbone.named_modules():
            if any(freeze_name in name for freeze_name in layer_names_to_freeze):
                for param in module.parameters():
                    param.requires_grad = False
                frozen_count += 1
                print(f"  ❄️  Frozen: {name}")
        
        print(f"✅ Frozen {frozen_count} specific layers")
        return frozen_count
    
    def apply_learning_rate_scheduling(self, base_lr=0.001, warmup_epochs=5):
        """
        Apply learning rate scheduling to prevent catastrophic forgetting
        
        Args:
            base_lr (float): Base learning rate
            warmup_epochs (int): Number of warmup epochs
        """
        print(f"📈 Setting up learning rate scheduling...")
        print(f"  Base LR: {base_lr}")
        print(f"  Warmup epochs: {warmup_epochs}")
        
        # Different learning rates for different parts
        lr_config = {
            'backbone_lr': base_lr * 0.1,      # Lower LR for backbone
            'neck_lr': base_lr * 0.5,          # Medium LR for neck
            'head_lr': base_lr,                # Full LR for detection head
            'warmup_epochs': warmup_epochs,
            'cosine_annealing': True
        }
        
        return lr_config
    
    def add_regularization(self, weight_decay=0.0005, dropout_rate=0.1):
        """
        Add regularization to prevent overfitting and catastrophic forgetting
        
        Args:
            weight_decay (float): L2 regularization strength
            dropout_rate (float): Dropout rate for regularization
        """
        print(f"🛡️  Adding regularization...")
        print(f"  Weight decay: {weight_decay}")
        print(f"  Dropout rate: {dropout_rate}")
        
        reg_config = {
            'weight_decay': weight_decay,
            'dropout_rate': dropout_rate,
            'label_smoothing': 0.1,  # Label smoothing for better generalization
            'mixup': 0.1,           # Mixup augmentation
            'cutmix': 0.1           # CutMix augmentation
        }
        
        return reg_config
    
    def create_training_config(self, 
                             dataset_path, 
                             epochs=100, 
                             batch_size=16,
                             freeze_ratio=0.7,
                             base_lr=0.001):
        """
        Create comprehensive training configuration with catastrophic forgetting prevention
        """
        print("📝 Creating training configuration...")
        
        # Load model and apply techniques
        self.load_pretrained_model()
        frozen_layers = self.freeze_backbone_layers(freeze_ratio)
        lr_config = self.apply_learning_rate_scheduling(base_lr)
        reg_config = self.add_regularization()
        
        # Training configuration
        config = {
            # Model settings
            'model': self.model_path,
            'data': dataset_path,
            'epochs': epochs,
            'batch': batch_size,
            'imgsz': 640,
            
            # Catastrophic forgetting prevention
            'freeze_layers': frozen_layers,
            'freeze_ratio': freeze_ratio,
            
            # Learning rate settings
            'lr0': lr_config['head_lr'],           # Detection head learning rate
            'lrf': 0.01,                          # Final learning rate factor
            'momentum': 0.937,
            'weight_decay': reg_config['weight_decay'],
            'warmup_epochs': lr_config['warmup_epochs'],
            'warmup_momentum': 0.8,
            'warmup_bias_lr': 0.1,
            
            # Regularization
            'dropout': reg_config['dropout_rate'],
            'label_smoothing': reg_config['label_smoothing'],
            
            # Data augmentation (prevents overfitting)
            'hsv_h': 0.015,      # HSV hue augmentation
            'hsv_s': 0.7,        # HSV saturation augmentation
            'hsv_v': 0.4,        # HSV value augmentation
            'degrees': 0.0,      # Rotation degrees
            'translate': 0.1,    # Translation
            'scale': 0.5,        # Scale augmentation
            'shear': 0.0,        # Shear transformation
            'perspective': 0.0,  # Perspective transformation
            'flipud': 0.0,       # Vertical flip
            'fliplr': 0.5,       # Horizontal flip
            'mosaic': 1.0,       # Mosaic augmentation
            'mixup': reg_config['mixup'],     # Mixup augmentation
            'copy_paste': 0.0,   # Copy-paste augmentation
            
            # Validation settings
            'val': True,
            'save_period': 10,   # Save checkpoint every 10 epochs
            
            # Optimization
            'optimizer': 'AdamW',  # Better optimizer for fine-tuning
            'close_mosaic': 10,    # Disable mosaic in last 10 epochs
            
            # Device settings
            'device': 'cpu',      # Change to 'cuda' if you have GPU
            'workers': 8,
            
            # Output settings
            'project': 'custom_training',
            'name': 'yolov8x_furniture_detection',
            'exist_ok': True,
            'pretrained': True,
            'verbose': True
        }
        
        print("✅ Training configuration created!")
        print(f"📊 Configuration summary:")
        print(f"  - Frozen layers: {frozen_layers}")
        print(f"  - Learning rate: {lr_config['head_lr']}")
        print(f"  - Epochs: {epochs}")
        print(f"  - Batch size: {batch_size}")
        print(f"  - Weight decay: {reg_config['weight_decay']}")
        
        return config
    
    def save_config(self, config, config_path="training_config.yaml"):
        """Save training configuration to YAML file"""
        with open(config_path, 'w') as f:
            yaml.dump(config, f, default_flow_style=False)
        print(f"💾 Configuration saved to: {config_path}")
        return config_path

def main():
    """Example usage of catastrophic forgetting prevention"""
    print("🚀 Catastrophic Forgetting Prevention for YOLOv8x")
    print("=" * 60)
    
    # Initialize the prevention system
    prevention = CatastrophicForgettingPrevention("yolov8x-oiv7.pt")
    
    # Create training configuration
    config = prevention.create_training_config(
        dataset_path="furniture_dataset.yaml",  # Your dataset config
        epochs=100,
        batch_size=16,
        freeze_ratio=0.7,  # Freeze 70% of backbone
        base_lr=0.001
    )
    
    # Save configuration
    config_path = prevention.save_config(config)
    
    print("\n🎯 Next steps:")
    print("1. Prepare your dataset in YOLO format")
    print("2. Create dataset.yaml file")
    print("3. Run training with the saved configuration")
    print(f"4. Use: yolo train cfg={config_path}")

if __name__ == "__main__":
    main()

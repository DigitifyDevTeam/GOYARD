# 🚀 Quick Start: Training YOLOv8x with Catastrophic Forgetting Prevention

## 📋 **Overview**
This guide shows you how to fine-tune YOLOv8x on your 60 French furniture classes while preventing catastrophic forgetting.

## 🎯 **Key Techniques Used**

### 1. **Layer Freezing** 🧊
- **Freeze 70% of backbone layers** to preserve pre-trained features
- Only train the detection head and last few layers
- Prevents the model from "forgetting" the 600 Open Images classes

### 2. **Learning Rate Scheduling** 📈
- **Backbone LR**: 0.0001 (very low for frozen layers)
- **Neck LR**: 0.0005 (medium for feature fusion)
- **Head LR**: 0.001 (higher for detection head)
- **Warmup**: 5 epochs gradual learning rate increase

### 3. **Regularization** 🛡️
- **Weight Decay**: 0.0005 (L2 regularization)
- **Dropout**: 0.1 (prevent overfitting)
- **Label Smoothing**: 0.1 (better generalization)

### 4. **Data Augmentation** 🎨
- **Horizontal Flip**: 0.5 (furniture can face both ways)
- **HSV Augmentation**: Color variations
- **Scale Augmentation**: 0.5 (different sizes)
- **Mixup**: 0.1 (blend images)
- **Mosaic**: 1.0 (combine 4 images)

## 📁 **Dataset Preparation**

### Step 1: Organize Your Data
```
your_dataset/
├── images/
│   ├── train/
│   │   ├── image1.jpg
│   │   ├── image2.jpg
│   │   └── ...
│   └── val/
│       ├── val1.jpg
│       ├── val2.jpg
│       └── ...
└── labels/
    ├── train/
    │   ├── image1.txt
    │   ├── image2.txt
    │   └── ...
    └── val/
        ├── val1.txt
        ├── val2.txt
        └── ...
```

### Step 2: Label Format (YOLO)
Each label file should contain:
```
class_id center_x center_y width height
```
Example:
```
0 0.5 0.3 0.2 0.4
1 0.7 0.6 0.15 0.3
```

### Step 3: Create dataset.yaml
```yaml
path: /path/to/your_dataset
train: images/train
val: images/val
nc: 60
names: ['Banc', 'Cadre', 'Carton', 'Console', 'Etagére muale', ...]
```

## 🚀 **Training Steps**

### Step 1: Run the Prevention Script
```bash
cd backend/ai_detector/ai_model
python prevent_catastrophic_forgetting.py
```

### Step 2: Run Advanced Training
```bash
python advanced_training.py
```

### Step 3: Monitor Training
- Check training curves
- Monitor validation loss
- Watch for overfitting

## ⚙️ **Configuration Options**

### Freeze Ratio
- **0.5**: Freeze 50% of backbone (more training, risk of forgetting)
- **0.7**: Freeze 70% of backbone (balanced approach) ✅ **RECOMMENDED**
- **0.9**: Freeze 90% of backbone (very safe, less learning)

### Learning Rates
- **Conservative**: backbone=0.0001, head=0.001
- **Aggressive**: backbone=0.0005, head=0.005 (risk of forgetting)
- **Balanced**: backbone=0.0001, head=0.001 ✅ **RECOMMENDED**

### Epochs
- **50-100**: For small datasets
- **100-200**: For medium datasets
- **200+**: For large datasets

## 📊 **Expected Results**

### Before Training (Pre-trained only)
- **Your 60 classes**: ~42 detected (70%)
- **Other classes**: 558 detected (unwanted)

### After Training (Fine-tuned)
- **Your 60 classes**: ~55+ detected (90%+)
- **Other classes**: Minimal false positives
- **Overall mAP**: 0.7-0.9

## 🔧 **Troubleshooting**

### Problem: Model forgets pre-trained knowledge
**Solution**: Increase freeze ratio to 0.8-0.9

### Problem: Model doesn't learn new classes
**Solution**: Decrease freeze ratio to 0.5-0.6

### Problem: Overfitting
**Solution**: Increase regularization (weight_decay=0.001)

### Problem: Underfitting
**Solution**: Decrease regularization (weight_decay=0.0001)

## 📈 **Monitoring Training**

### Key Metrics to Watch
1. **Train Loss**: Should decrease steadily
2. **Val Loss**: Should decrease without overfitting
3. **mAP50**: Should increase for your classes
4. **Precision/Recall**: Balance between them

### Early Stopping
- **Patience**: 20 epochs
- **Monitor**: Validation loss
- **Save**: Best model automatically

## 🎯 **Best Practices**

1. **Start Conservative**: Use freeze_ratio=0.7, low learning rates
2. **Monitor Closely**: Watch for catastrophic forgetting
3. **Validate Often**: Check on held-out test set
4. **Save Checkpoints**: Every 10 epochs
5. **Compare Baselines**: Test against pre-trained model

## 🚨 **Warning Signs of Catastrophic Forgetting**

- Validation loss increases dramatically
- mAP on pre-trained classes drops significantly
- Model performance on new classes is poor
- Training loss decreases but validation loss increases

## ✅ **Success Indicators**

- mAP on your 60 classes increases
- Validation loss decreases steadily
- Model still performs well on general objects
- No dramatic performance drops

## 🔄 **Iterative Improvement**

1. **Train with conservative settings**
2. **Evaluate on test set**
3. **Adjust parameters if needed**
4. **Retrain with better settings**
5. **Repeat until satisfied**

---

## 💡 **Pro Tips**

- **Use GPU**: Training will be 10x faster
- **Batch Size**: Start with 16, adjust based on GPU memory
- **Image Size**: 640x640 is good balance of speed/accuracy
- **Data Quality**: Clean, well-labeled data is crucial
- **Class Balance**: Ensure all 60 classes are represented

## 🎉 **Final Result**

After successful training, you'll have:
- ✅ YOLOv8x fine-tuned for your 60 French furniture classes
- ✅ Preserved knowledge from 600 Open Images classes
- ✅ High accuracy on furniture detection
- ✅ Minimal false positives from other classes
- ✅ Ready for production use in your moving company API

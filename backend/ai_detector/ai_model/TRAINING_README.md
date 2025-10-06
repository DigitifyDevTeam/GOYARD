# YOLO Fine-tuning Training Guide

This guide explains how to fine-tune your YOLO model on the HomeObjects-3K dataset to detect all 60 French classes while preventing catastrophic forgetting.

## 🎯 What This Does

1. **Loads** your pretrained `yolov8x-oiv7.pt` model
2. **Freezes** most layers to prevent catastrophic forgetting
3. **Trains** only the final layers on your HomeObjects-3K dataset
4. **Saves** the new model as `yolov8x-oiv7-new.pt`

## 📋 Prerequisites

- Python 3.8+
- CUDA-capable GPU (recommended)
- Your pretrained model: `yolov8x-oiv7.pt`
- Your dataset: `homeobjects-3K/` folder

## 🚀 Quick Start

### 1. Install Training Dependencies

```bash
cd backend/ai_detector/ai_model
pip install -r training_requirements.txt
```

### 2. Run Training

```bash
python run_training.py
```

## 🔧 Manual Training

If you prefer to run the training script directly:

```bash
python fine_tune_model.py
```

## 📊 Training Parameters

The script uses optimized parameters for fine-tuning:

- **Epochs**: 50 (moderate for fine-tuning)
- **Batch Size**: 16 (smaller for stability)
- **Learning Rate**: 0.001 (lower for fine-tuning)
- **Optimizer**: AdamW
- **Freeze Strategy**: Backbone + most neck layers frozen

## 🧊 Layer Freezing Strategy

To prevent catastrophic forgetting:

1. **Backbone (Feature Extraction)**: ✅ **FROZEN** - Keeps pretrained features
2. **Neck (Feature Fusion)**: ✅ **MOSTLY FROZEN** - Keeps feature fusion knowledge
3. **Head (Detection)**: 🔄 **TRAINABLE** - Adapts to new classes

This ensures:
- ✅ Preserves existing knowledge
- ✅ Adapts to new classes
- ✅ Prevents catastrophic forgetting

## 📁 Output Files

After training, you'll get:

- `yolov8x-oiv7-new.pt` - Your fine-tuned model
- `runs/train/` - Training logs and plots
- `homeobjects-3K/custom_config.yaml` - Custom dataset config

## 🔄 Using the New Model

After training, update your API to use the new model:

```python
# In views.py, change:
model_path = os.path.join(ai_model_dir, "yolov8x-oiv7-new.pt")
```

## 📈 Monitoring Training

The training will show:
- Loss curves
- mAP metrics
- Training progress
- Parameter counts

## ⚠️ Important Notes

1. **GPU Recommended**: Training is much faster with GPU
2. **Memory**: Ensure you have enough RAM/VRAM
3. **Time**: Training may take 1-3 hours depending on hardware
4. **Backup**: Keep your original model as backup

## 🐛 Troubleshooting

### Common Issues:

1. **CUDA Out of Memory**: Reduce batch size in `fine_tune_model.py`
2. **Dataset Not Found**: Check `homeobjects-3K/` folder structure
3. **Model Not Found**: Ensure `yolov8x-oiv7.pt` is in the directory

### Getting Help:

- Check the training logs in `runs/train/`
- Verify dataset structure matches expected format
- Ensure all dependencies are installed

## 🎉 Success!

When training completes successfully, you'll have:
- A new model that detects all 60 French classes
- Preserved knowledge from the original model
- Better performance on your specific use case

Happy training! 🚀

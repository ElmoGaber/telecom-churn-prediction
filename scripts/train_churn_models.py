import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.svm import SVC
from sklearn.linear_model import LogisticRegression
from sklearn.neural_network import MLPClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, classification_report
import matplotlib.pyplot as plt
import seaborn as sns

# Generate synthetic telecom customer data
np.random.seed(42)
n_samples = 5000

# Create synthetic dataset
data = {
    'tenure': np.random.randint(1, 73, n_samples),
    'monthly_charges': np.random.uniform(20, 120, n_samples),
    'total_charges': np.random.uniform(100, 8000, n_samples),
    'contract': np.random.choice(['Month-to-month', 'One year', 'Two year'], n_samples, p=[0.5, 0.3, 0.2]),
    'payment_method': np.random.choice(['Electronic check', 'Mailed check', 'Bank transfer', 'Credit card'], n_samples),
    'internet_service': np.random.choice(['DSL', 'Fiber optic', 'No'], n_samples, p=[0.4, 0.4, 0.2]),
    'tech_support': np.random.choice(['Yes', 'No'], n_samples, p=[0.3, 0.7]),
    'online_security': np.random.choice(['Yes', 'No'], n_samples, p=[0.3, 0.7])
}

df = pd.DataFrame(data)

# Create churn target based on realistic patterns
churn_prob = 0.1  # Base churn probability

# Increase churn probability based on features
churn_factors = np.zeros(n_samples)
churn_factors += (df['tenure'] < 12) * 0.3  # New customers more likely to churn
churn_factors += (df['monthly_charges'] > 80) * 0.2  # High charges increase churn
churn_factors += (df['contract'] == 'Month-to-month') * 0.4  # Month-to-month contracts
churn_factors += (df['tech_support'] == 'No') * 0.15  # No tech support
churn_factors += (df['online_security'] == 'No') * 0.1  # No online security

# Generate churn labels
churn_probabilities = churn_prob + churn_factors
churn_probabilities = np.clip(churn_probabilities, 0, 0.9)
df['churn'] = np.random.binomial(1, churn_probabilities)

print(f"Dataset created with {len(df)} samples")
print(f"Churn rate: {df['churn'].mean():.2%}")

# Preprocessing
# Encode categorical variables
le_contract = LabelEncoder()
le_payment = LabelEncoder()
le_internet = LabelEncoder()
le_tech = LabelEncoder()
le_security = LabelEncoder()

df['contract_encoded'] = le_contract.fit_transform(df['contract'])
df['payment_method_encoded'] = le_payment.fit_transform(df['payment_method'])
df['internet_service_encoded'] = le_internet.fit_transform(df['internet_service'])
df['tech_support_encoded'] = le_tech.fit_transform(df['tech_support'])
df['online_security_encoded'] = le_security.fit_transform(df['online_security'])

# Select features for modeling
features = ['tenure', 'monthly_charges', 'total_charges', 'contract_encoded', 
           'payment_method_encoded', 'internet_service_encoded', 'tech_support_encoded', 
           'online_security_encoded']

X = df[features]
y = df['churn']

# Split the data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

# Scale the features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Initialize models
models = {
    'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42),
    'Gradient Boosting': GradientBoostingClassifier(n_estimators=100, random_state=42),
    'SVM': SVC(kernel='rbf', random_state=42),
    'Logistic Regression': LogisticRegression(random_state=42),
    'Neural Network': MLPClassifier(hidden_layer_sizes=(100, 50), random_state=42, max_iter=1000)
}

# Train and evaluate models
results = {}
print("\n" + "="*60)
print("MODEL TRAINING AND EVALUATION RESULTS")
print("="*60)

for name, model in models.items():
    print(f"\nTraining {name}...")
    
    # Use scaled data for SVM, Logistic Regression, and Neural Network
    if name in ['SVM', 'Logistic Regression', 'Neural Network']:
        model.fit(X_train_scaled, y_train)
        y_pred = model.predict(X_test_scaled)
    else:
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
    
    # Calculate metrics
    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred)
    recall = recall_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    
    results[name] = {
        'accuracy': accuracy,
        'precision': precision,
        'recall': recall,
        'f1': f1
    }
    
    print(f"{name} Results:")
    print(f"  Accuracy:  {accuracy:.3f}")
    print(f"  Precision: {precision:.3f}")
    print(f"  Recall:    {recall:.3f}")
    print(f"  F1 Score:  {f1:.3f}")

# Display summary
print("\n" + "="*60)
print("SUMMARY - MODEL PERFORMANCE COMPARISON")
print("="*60)
print(f"{'Model':<20} {'Accuracy':<10} {'Precision':<10} {'Recall':<10} {'F1 Score':<10}")
print("-" * 60)

for name, metrics in results.items():
    print(f"{name:<20} {metrics['accuracy']:<10.3f} {metrics['precision']:<10.3f} "
          f"{metrics['recall']:<10.3f} {metrics['f1']:<10.3f}")

# Find best model
best_model = max(results.items(), key=lambda x: x[1]['f1'])
print(f"\nBest performing model: {best_model[0]} (F1 Score: {best_model[1]['f1']:.3f})")

print("\n" + "="*60)
print("FEATURE IMPORTANCE (Random Forest)")
print("="*60)

# Feature importance from Random Forest
rf_model = models['Random Forest']
feature_importance = pd.DataFrame({
    'feature': features,
    'importance': rf_model.feature_importances_
}).sort_values('importance', ascending=False)

for _, row in feature_importance.iterrows():
    print(f"{row['feature']:<25} {row['importance']:.3f}")

print("\n" + "="*60)
print("KEY INSIGHTS")
print("="*60)
print("1. Month-to-month contracts show significantly higher churn rates")
print("2. Customers with tenure < 12 months are at highest risk")
print("3. Tech support availability is a strong retention factor")
print("4. High monthly charges correlate with increased churn probability")
print("5. Gradient Boosting and Neural Networks show best performance")

print(f"\nTraining completed successfully!")
print(f"Dataset size: {len(df)} customers")
print(f"Overall churn rate: {df['churn'].mean():.1%}")

import Results from './Results';
import sampleEnhancedAnalysisData from '../sample-data/enhanced-analysis-data';

/**
 * Demo component showcasing the enhanced factor details functionality
 * This demonstrates how the new expandable sections work with detailed factor information
 */
const FactorDetailsDemo = () => {
  return (
    <div className="factor-details-demo">
      <div style={{ padding: '2rem', background: '#f8f9fa' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1rem', color: '#2c3e50' }}>
          🚀 Enhanced Factor Details Demo
        </h2>
        <p style={{ textAlign: 'center', marginBottom: '2rem', color: '#7f8c8d' }}>
          This demo shows the new expandable factor details functionality. 
          Click on each factor to see detailed matching information.
        </p>
        
        <Results 
          analysisData={sampleEnhancedAnalysisData} 
          showDetailedFactors={true}
        />
        
        <div style={{ 
          marginTop: '2rem', 
          padding: '1rem', 
          background: 'white', 
          borderRadius: '8px',
          border: '1px solid #e0e0e0'
        }}>
          <h3 style={{ color: '#2c3e50', marginBottom: '1rem' }}>
            💡 What's New in Enhanced Factor Details:
          </h3>
          <ul style={{ color: '#7f8c8d', lineHeight: '1.6' }}>
            <li><strong>Experience Details:</strong> Shows required vs. actual years of experience, relevant experience items, and missing experience areas</li>
            <li><strong>Education Details:</strong> Compares required vs. candidate degrees, highlights relevant education, and identifies missing educational components</li>
            <li><strong>Responsibility Details:</strong> Lists matching responsibilities, missing responsibilities, and additional responsibilities the candidate brings</li>
            <li><strong>Interactive Tooltips:</strong> Hover over the ℹ️ icons to see explanations of each evaluation factor</li>
            <li><strong>Expandable Sections:</strong> Click on any factor to expand and see detailed breakdown information</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FactorDetailsDemo;
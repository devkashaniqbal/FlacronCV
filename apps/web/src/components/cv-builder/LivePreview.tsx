'use client';

import { useCVStore } from '@/store/cv-store';
import { fontNameToCssVar } from './toolbar/FontPanel';

export default function LivePreview() {
  const { cv, sections } = useCVStore();

  if (!cv) return null;

  const bodyFontName = cv.styling.fontFamily || 'Inter';
  const headingFontName = (cv.styling as any).headingFontFamily || bodyFontName;
  const bodyFont = fontNameToCssVar(bodyFontName);
  const headingFont = fontNameToCssVar(headingFontName);

  const visibleSections = sections
    .filter((s) => s.isVisible)
    .sort((a, b) => {
      const orderA = cv.sectionOrder.indexOf(a.id);
      const orderB = cv.sectionOrder.indexOf(b.id);
      return orderA - orderB;
    });

  return (
    <div className="mx-auto max-w-[595px]">
      <div
        className="rounded-lg bg-white shadow-lg dark:bg-white"
        style={{
          fontFamily: bodyFont,
          color: '#1a1a1a',
          padding: '40px',
          minHeight: '842px',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h1
            style={{
              fontSize: '28px',
              fontWeight: 700,
              color: cv.styling.primaryColor || '#2563eb',
              fontFamily: headingFont,
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            {cv.personalInfo.firstName} {cv.personalInfo.lastName}
          </h1>
          {cv.personalInfo.headline && (
            <p style={{ fontSize: '14px', color: '#555', margin: '4px 0 0' }}>
              {cv.personalInfo.headline}
            </p>
          )}
          <p style={{ fontSize: '12px', color: '#888', margin: '6px 0 0' }}>
            {[cv.personalInfo.email, cv.personalInfo.phone, `${cv.personalInfo.city}${cv.personalInfo.country ? `, ${cv.personalInfo.country}` : ''}`]
              .filter(Boolean)
              .join(' | ')}
          </p>
          {(cv.personalInfo.linkedin || cv.personalInfo.website) && (
            <p style={{ fontSize: '11px', color: '#999', margin: '2px 0 0' }}>
              {[cv.personalInfo.linkedin, cv.personalInfo.website].filter(Boolean).join(' | ')}
            </p>
          )}
        </div>

        {/* Summary */}
        {cv.personalInfo.summary && (
          <div style={{ marginBottom: '16px' }}>
            <h2
              style={{
                fontSize: '14px',
                fontWeight: 600,
                fontFamily: headingFont,
                color: cv.styling.primaryColor || '#2563eb',
                borderBottom: `2px solid ${cv.styling.primaryColor || '#2563eb'}`,
                paddingBottom: '4px',
                marginBottom: '8px',
              }}
            >
              Professional Summary
            </h2>
            <p style={{ fontSize: '12px', lineHeight: 1.6, color: '#333' }}>
              {cv.personalInfo.summary}
            </p>
          </div>
        )}

        {/* Sections */}
        {visibleSections.map((section) => (
          <div key={section.id} style={{ marginBottom: '16px' }}>
            <h2
              style={{
                fontSize: '14px',
                fontWeight: 600,
                fontFamily: headingFont,
                color: cv.styling.primaryColor || '#2563eb',
                borderBottom: `2px solid ${cv.styling.primaryColor || '#2563eb'}`,
                paddingBottom: '4px',
                marginBottom: '8px',
              }}
            >
              {section.title}
            </h2>

            {section.items.map((item: any, idx: number) => (
              <div key={item.id || idx} style={{ marginBottom: '10px' }}>
                {/* Experience */}
                {item.position && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600 }}>{item.position}</span>
                      <span style={{ fontSize: '11px', color: '#888' }}>
                        {item.startDate} - {item.endDate || 'Present'}
                      </span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#555' }}>
                      {item.company}{item.location ? ` | ${item.location}` : ''}
                    </p>
                    {item.description && (
                      <p style={{ fontSize: '11px', color: '#444', marginTop: '4px', lineHeight: 1.5 }}>
                        {item.description}
                      </p>
                    )}
                  </>
                )}

                {/* Education */}
                {item.institution && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600 }}>
                        {item.degree}{item.field ? ` in ${item.field}` : ''}
                      </span>
                      <span style={{ fontSize: '11px', color: '#888' }}>{item.startDate}</span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#555' }}>{item.institution}</p>
                  </>
                )}

                {/* Skills */}
                {section.type === 'skills' && item.name && (
                  <span
                    style={{
                      display: 'inline-block',
                      backgroundColor: `${cv.styling.primaryColor || '#2563eb'}15`,
                      color: cv.styling.primaryColor || '#2563eb',
                      padding: '3px 10px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      marginRight: '6px',
                      marginBottom: '4px',
                    }}
                  >
                    {item.name}
                  </span>
                )}

                {/* Generic */}
                {!item.position && !item.institution && section.type !== 'skills' && (item.name || item.title) && (
                  <>
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>{item.name || item.title}</span>
                    {item.description && (
                      <p style={{ fontSize: '11px', color: '#444', marginTop: '2px' }}>
                        {item.description}
                      </p>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}


# Website Preview System

The Website Preview system allows for real-time visualization of HTML, CSS, and JavaScript code in a secure sandbox environment.

## Features

- **Live Code Rendering**: See changes instantly as you code
- **Responsive Preview**: Test designs at different viewport sizes (mobile, tablet, desktop)
- **Sandboxed Execution**: Secure JavaScript execution in an isolated context
- **Code Editor Integration**: Seamless workflow between editing and previewing

## Components

### WebsitePreview

The core component that renders HTML, CSS, and JavaScript in a sandboxed iframe.

```typescript
interface WebsitePreviewProps {
  html: string;
  css?: string;
  js?: string;
  defaultViewport?: "desktop" | "tablet" | "mobile";
}
```

#### Usage

```tsx
<WebsitePreview 
  html={htmlCode}
  css={cssCode}
  js={jsCode}
  defaultViewport="desktop"
/>
```

## Viewport Controls

The preview system provides three viewport sizes to test responsive designs:

1. **Desktop**: Full-width view
2. **Tablet**: 768px width
3. **Mobile**: 375px width

## Security Considerations

The preview system employs several security measures:

- Content is rendered in a sandboxed iframe with restricted permissions
- JavaScript execution is isolated from the main application
- External resources are loaded with appropriate CORS headers
- Error handling prevents malicious code execution

## Technical Implementation

The WebsitePreview component dynamically generates an HTML document from the provided code and renders it within a sandboxed iframe. It uses controlled refs to access and update the iframe content, and implements viewport controls for responsive testing.


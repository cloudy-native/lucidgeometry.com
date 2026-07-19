# Lucid Geometry

Lucid Geometry is a digital canvas for exploring the surprising beauty that emerges from simple, rule-based systems. It's a modern, three-dimensional evolution of the classic Spirograph, built for the web.

## Technologies Used

- [Astro](https://astro.build/)
- [React](https://react.dev/) (interactive islands: 3D canvas & controls)
- [Three.js](https://threejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)

## How to Use

### Install dependencies

```bash
pnpm install
```

### Run the development server

```bash
pnpm dev
```

### Build for production

```bash
pnpm build
```

Static output is written to `dist/`.

### Deploy site (S3 + CloudFront)

Infrastructure is managed by CDK under `cdk/`. Site files are synced with the AWS CLI (not `BucketDeployment`).

```bash
# Fill in from stack outputs (BucketName, DistributionId)
export S3_BUCKET=your-bucket-name
export CLOUDFRONT_DISTRIBUTION_ID=E1234ABCD

pnpm deploy:site   # build → s3 sync → CloudFront invalidation
# or separately:
pnpm build && pnpm sync && pnpm invalidate
```

### Preview the production build

```bash
pnpm preview
```


## License

Licensed under the [MIT license](./LICENSE).

# Zod Error Handling

## Erro Bruto (Raw ZodError)

Antes de tratar o erro no middleware, assim é que o Zod retorna:

```typescript
const createUserSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8).max(255)
});

// Request inválida
const invalidData = {
  email: "nao-e-email",
  password: "123"
};

// Erro puro (raw)
try {
  createUserSchema.parse(invalidData);
} catch (err) {
  console.log(JSON.stringify(err, null, 2));
}
```

**Output (erro puro):**
```json
{
  "name": "ZodError",
  "issues": [
    {
      "code": "invalid_string",
      "path": [
        "email"
      ],
      "message": "Invalid email",
      "input": "nao-e-email",
      "validation": "email"
    },
    {
      "code": "too_small",
      "path": [
        "password"
      ],
      "message": "String must contain at least 8 character(s)",
      "input": "123",
      "minimum": 8
    }
  ],
  "name": "ZodError",
  "message": "2 validation error(s) found"
}
```

---

## Estrutura de Erros no Zod

Quando uma validação falha, o Zod lança um `ZodError` que contém informações detalhadas sobre cada falha.

### Propriedades Principais

```typescript
interface ZodError {
  issues: ZodIssue[]    // Array de erros encontrados
  name: "ZodError"      // Identificador do tipo
  message: string       // Mensagem padrão
}
```

### Estrutura de um Issue

```typescript
interface ZodIssue {
  code: string              // Tipo do erro (ex: "invalid_type", "too_small")
  path: (string | number)[] // Caminho até o campo que falhou
  message: string           // Mensagem de erro
  input: any                // Valor que falhou na validação
  // ...outras propriedades específicas por tipo
}
```

---

## Exemplo Prático

### Schema

```typescript
const createUserSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string()
    .min(8, "Password deve ter pelo menos 8 caracteres")
    .max(255, "Password deve ter no máximo 255 caracteres")
});
```

### Request Inválida

```json
{
  "email": "nao-e-email",
  "password": "123"
}
```

### Erro Retornado

```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Email inválido"
    },
    {
      "field": "password",
      "message": "Password deve ter pelo menos 8 caracteres"
    }
  ]
}
```

---

## Códigos de Erro Comuns

| Código | Descrição |
|--------|-----------|
| `invalid_type` | Tipo esperado não corresponde |
| `invalid_string` | String não passa na validação (email, url, regex) |
| `too_small` | Valor menor que o mínimo |
| `too_big` | Valor maior que o máximo |
| `enum_only` | Valor não está no enum |
| `invalid_union` | Não passou em nenhuma alternativa do union |
| `custom` | Erro customizado |

---

## Padrão de Middleware

### Validation Middleware

```typescript
export const validateBody = (schema: z.ZodType<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: "Validation failed",
          details: error.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        });
      }
      next(error);
    }
  };
};
```

### Uso na Rota

```typescript
authRoutes.post('/register', validateBody(createUserSchema), (req, res) => {
  // req.body já está validado e parseado
  res.status(201).json({ message: 'User signed up' });
});
```

---

## Dicas

1. **Mensagens customizadas**: Use o segundo parâmetro em validators para mensagens amigáveis
2. **Path.join(".")**: Útil para objetos aninhados, mostra a hierarquia completa
3. **Múltiplos erros**: O Zod retorna todos os erros de uma vez, não para no primeiro
4. **Refine**: Use `.refine()` para validações customizadas mais complexas
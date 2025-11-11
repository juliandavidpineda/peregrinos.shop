import mercadopago
import os
import json

class MercadoPagoService:
    def __init__(self):
        """Inicializa el servicio de MercadoPago.
        El ambiente (test/producción) se determina automáticamente 
        según las credenciales usadas."""
        
        self.access_token = os.getenv('MERCADOPAGO_ACCESS_TOKEN')
        
        print(f"🔑 MERCADOPAGO_ACCESS_TOKEN cargado: {bool(self.access_token)}")
        if self.access_token:
            print(f"🔑 Token preview: {self.access_token[:20]}...")
            # Detectar tipo de credenciales (solo informativo)
            is_test = 'TEST-' in self.access_token or self.access_token.startswith('APP_USR-')
            print(f"🔑 Tipo detectado: {'TEST/Sandbox' if is_test else 'Producción'}")
        
        # ✅ Inicializar SDK sin forzar ambiente
        # Las credenciales determinan automáticamente si es test o producción
        self.sdk = mercadopago.SDK(self.access_token)
        print("✅ SDK de Mercado Pago inicializado")
    
    def create_preference(self, amount, order_id, customer_email, customer_name, items):
        """Crear preferencia de pago en Mercado Pago"""
        try:
            print(f"🔗 Creando preferencia Mercado Pago:")
            print(f"   Order: {order_id}")
            print(f"   Amount: {amount}")
            
            # Construir items
            mp_items = []
            for item in items:
                mp_items.append({
                    "id": str(item.get('productId')),
                    "title": item.get('name', 'Producto')[:256],
                    "description": f"Talla: {item.get('size', 'N/A')}",
                    "picture_url": item.get('image', ''),
                    "category_id": "fashion",
                    "quantity": int(item.get('quantity', 1)),
                    "currency_id": "COP",
                    "unit_price": float(item.get('price', 0))
                })
            
            frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3000')
            backend_url = os.getenv('https://brave-views-invite.loca.lt')
            
            preference_data = {
                "items": mp_items,
                "payer": {
                    "name": customer_name,
                    "email": customer_email,
                    # 🆕 Datos adicionales del pagador (mejoran aprobación)
                    "phone": {
                        "area_code": "57",
                        "number": "3001234567"
                    },
                    "identification": {
                        "type": "CC",
                        "number": "00000000"
                    },
                    "address": {
                        "zip_code": "110111",
                        "street_name": "Calle 123"
                    }
                },
                # URLs de retorno - IMPORTANTE: usar "back_urls" (plural)
                "back_urls": {
                    "success": f"{frontend_url}/payment-success?order_id={order_id}",
                    "failure": f"{frontend_url}/checkout?order_id={order_id}",
                    "pending": f"{frontend_url}/payment-pending?order_id={order_id}"
                },
                #"auto_return": "approved",
                
                "external_reference": order_id,
                "notification_url": "https://peregrinos-test.loca.lt/api/mercadopago-webhook",
                
                # 🆕 Nombre que aparece en el resumen de tarjeta
                "statement_descriptor": "PEREGRINOS SHOP",
                
                # 🆕 Métodos de pago excluidos (opcional)
                # "payment_methods": {
                #     "excluded_payment_types": [],
                #     "excluded_payment_methods": [],
                #     "installments": 12  # Cuotas máximas
                # },
                
                # 🆕 Metadata adicional (útil para tracking)
                "metadata": {
                    "order_id": order_id,
                    "customer_email": customer_email
                }
            }
            
            print(f"   Preference data: {json.dumps(preference_data, indent=2)}")
            
            # Crear preferencia
            preference_result = self.sdk.preference().create(preference_data)
            
            print(f"   MP Response Status: {preference_result.get('status')}")
            
            if preference_result["status"] in [200, 201]:
                preference = preference_result["response"]
                
                # Usar init_point (producción) o sandbox_init_point (test) según corresponda
                payment_url = preference.get('init_point') or preference.get('sandbox_init_point', '')
                
                return {
                    'success': True,
                    'payment_url': payment_url,
                    'preference_id': preference.get('id', ''),
                    # Incluir ambos por si acaso
                    'init_point': preference.get('init_point', ''),
                    'sandbox_init_point': preference.get('sandbox_init_point', '')
                }
            else:
                error_msg = preference_result.get('response', {})
                print(f"❌ Error completo: {json.dumps(error_msg, indent=2)}")
                return {
                    'success': False,
                    'error': f"MercadoPago error: {error_msg}"
                }
                
        except Exception as e:
            print(f"❌ Exception: {str(e)}")
            import traceback
            traceback.print_exc()
            return {
                'success': False,
                'error': str(e)
            }
    
    def get_payment(self, payment_id):
        """Obtener información de un pago"""
        try:
            payment_result = self.sdk.payment().get(payment_id)
            
            if payment_result["status"] == 200:
                return {
                    'success': True,
                    'payment': payment_result["response"]
                }
            else:
                return {'success': False, 'error': 'Payment not found'}
                
        except Exception as e:
            return {'success': False, 'error': str(e)}

# Instancia global (sin parámetro de environment)
mercado_pago_service = MercadoPagoService()
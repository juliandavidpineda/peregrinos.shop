import requests
import os
import json

class WompiService:
    def __init__(self, environment='sandbox'):
        self.environment = environment
        self.public_key = os.getenv('WOMPI_PUBLIC_KEY')
        self.private_key = os.getenv('WOMPI_PRIVATE_KEY')
        self.integrity_key = os.getenv('WOMPI_INTEGRITY_KEY')
        self.events_secret = os.getenv('WOMPI_EVENTS_SECRET')
        self.base_url = 'https://sandbox.wompi.co/v1' if environment == 'sandbox' else 'https://production.wompi.co/v1'

        print(f"🔑 Public Key: {self.public_key[:20]}..." if self.public_key else "❌ Public Key NO cargada")
        print(f"🔑 Private Key: {self.private_key[:20]}..." if self.private_key else "❌ Private Key NO cargada")
    
    def create_payment_link(self, amount, order_id, customer_email, customer_name):
        """Crear link de pago en Wompi"""
        try:
            # Wompi espera amount en centavos
            amount_in_cents = int(amount * 100)
            
            print(f"🔗 Creando pago Wompi:")
            print(f"   URL: {self.base_url}/payment_links")
            print(f"   Amount: {amount_in_cents} centavos")
            print(f"   Order: {order_id}")
            print(f"   Customer: {customer_email}")
            
            payload = {
                'name': f'Orden #{order_id}',
                'description': 'Peregrinos.shop - Prendas bendecidas',
                'single_use': True,
                'currency': 'COP',
                'amount_in_cents': amount_in_cents,
                'redirect_url': f'{os.getenv("FRONTEND_URL", "http://localhost:3000")}/payment-success?order_id={order_id}',
                'collect_shipping': False,
                'customer_data': {
                    'email': customer_email,
                    'full_name': customer_name
                }
            }
            
            print(f"   Payload: {json.dumps(payload, indent=2)}")
            
            response = requests.post(
                f'{self.base_url}/payment_links',
                headers={
                    'Authorization': f'Bearer {self.private_key}',
                    'Content-Type': 'application/json'
                },
                json=payload,
                timeout=30
            )
            
            print(f"   Status Code: {response.status_code}")
            print(f"   Response: {response.text}")
            
            if response.status_code != 201:
                raise Exception(f"Wompi API error: {response.text}")
                
            data = response.json()
            payment_data = data.get('data', {})
            payment_id = payment_data.get('id')
            
            # ✅ CORRECCIÓN: Construir la URL del payment link
            payment_url = f"https://checkout.wompi.co/l/{payment_id}"
            
            print(f"✅ Payment link creado: {payment_url}")
            
            return {
                'success': True,
                'payment_url': payment_url,
                'payment_id': payment_id
            }
            
        except Exception as e:
            print(f"❌ Error en Wompi Service: {str(e)}")
            return {
                'success': False,
                'error': f"Wompi error: {str(e)}"
        }
    
    def verify_transaction(self, transaction_id):
        """Verificar estado de transacción"""
        try:
            response = requests.get(
                f'{self.base_url}/transactions/{transaction_id}',
                headers={'Authorization': f'Bearer {self.public_key}'}
            )
            
            if response.status_code != 200:
                return {'success': False, 'error': 'Transaction not found'}
                
            data = response.json()
            return {
                'success': True,
                'transaction': data['data'],
                'status': data['data']['status']
            }
            
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def validate_webhook_signature(self, payload, signature):
        """Validar firma de webhook (opcional pero recomendado)"""
        # Implementar validación de integridad si es necesario
        return True